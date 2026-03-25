import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as topojson from 'topojson-client';

const WORLD_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Desktop viewport bounds: Americas + Europe
const DESKTOP_BOUNDS = {
  lonMin: -120, lonMax: 40,
  latMin: -56,  latMax: 62,
};

// Minimum span so the map doesn't zoom absurdly close for 1-2 nearby cities
const MIN_LON_SPAN = 50;
const MIN_LAT_SPAN = 35;
// Padding around location cluster (degrees)
const MOBILE_PAD = 15;

function computeMobileBounds(locations) {
  const valid = locations.filter(l => l.lat != null && l.lng != null);
  if (valid.length === 0) return DESKTOP_BOUNDS;

  let minLon = Infinity, maxLon = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;
  valid.forEach(l => {
    if (l.lng < minLon) minLon = l.lng;
    if (l.lng > maxLon) maxLon = l.lng;
    if (l.lat < minLat) minLat = l.lat;
    if (l.lat > maxLat) maxLat = l.lat;
  });

  // Add padding
  minLon -= MOBILE_PAD;
  maxLon += MOBILE_PAD;
  minLat -= MOBILE_PAD;
  maxLat += MOBILE_PAD;

  // Enforce minimum span
  const lonSpan = maxLon - minLon;
  const latSpan = maxLat - minLat;
  if (lonSpan < MIN_LON_SPAN) {
    const mid = (minLon + maxLon) / 2;
    minLon = mid - MIN_LON_SPAN / 2;
    maxLon = mid + MIN_LON_SPAN / 2;
  }
  if (latSpan < MIN_LAT_SPAN) {
    const mid = (minLat + maxLat) / 2;
    minLat = mid - MIN_LAT_SPAN / 2;
    maxLat = mid + MIN_LAT_SPAN / 2;
  }

  return { lonMin: minLon, lonMax: maxLon, latMin: minLat, latMax: maxLat };
}

// Aspect-ratio-aware projection: fit the geo viewport into the canvas
// without stretching, centering with offsets.
function getProjection(width, height, bounds) {
  const geoW = bounds.lonMax - bounds.lonMin;
  const geoH = bounds.latMax - bounds.latMin;
  const geoAspect = geoW / geoH;
  const canvasAspect = width / height;

  let scale, offsetX, offsetY;
  if (canvasAspect > geoAspect) {
    scale = height / geoH;
    offsetX = (width - geoW * scale) / 2;
    offsetY = 0;
  } else {
    scale = width / geoW;
    offsetX = 0;
    offsetY = (height - geoH * scale) / 2;
  }
  return { scale, offsetX, offsetY };
}

function projectBounded(lon, lat, width, height, bounds) {
  const { scale, offsetX, offsetY } = getProjection(width, height, bounds);
  const x = (lon - bounds.lonMin) * scale + offsetX;
  const y = (bounds.latMax - lat) * scale + offsetY;
  return [x, y];
}

function isInView(lon, lat, bounds) {
  return lon >= bounds.lonMin && lon <= bounds.lonMax && lat >= bounds.latMin && lat <= bounds.latMax;
}

function ClampedTooltip({ dot, containerRef, onMouseEnter, onMouseLeave, isMobile }) {
  const tooltipRef = useRef(null);
  const [style, setStyle] = useState({});

  useEffect(() => {
    const el = tooltipRef.current;
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    const MARGIN = 6;

    let left = dot.x;
    let translateX = '-50%';
    let top = null;
    let bottom = null;

    // Flip below if too close to the top
    const spaceAbove = dot.y;
    if (spaceAbove < tRect.height + 18) {
      top = dot.y + 14;
    } else {
      bottom = cRect.height - dot.y + 12;
    }

    // Horizontal clamping
    const halfW = tRect.width / 2;
    if (dot.x - halfW < MARGIN) {
      left = MARGIN;
      translateX = '0';
    } else if (dot.x + halfW > cRect.width - MARGIN) {
      left = cRect.width - MARGIN;
      translateX = '-100%';
    }

    const newStyle = { left, transform: `translateX(${translateX})` };
    if (top != null) newStyle.top = top;
    else newStyle.bottom = bottom;
    setStyle(newStyle);
  }, [dot.x, dot.y, containerRef]);

  return (
    <div
      ref={tooltipRef}
      className="radar-tooltip"
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="radar-tooltip__city">{dot.city}</div>
      {dot.dates.map((d, i) => (
        <div key={i} className="radar-tooltip__date-row">
          <span className="radar-tooltip__date">{formatDate(d.date)}</span>
          <a
            className="radar-tooltip__link"
            href={d.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            [ TICKETS ]
          </a>
        </div>
      ))}
    </div>
  );
}

export default function RadarMap({ locations, highlightedCityKey, setHighlightedCityKey, loading }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [polygons, setPolygons] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Fetch and parse world topology once
  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_TOPO_URL)
      .then(r => r.json())
      .then(topoData => {
        if (cancelled) return;
        const countries = topojson.feature(topoData, topoData.objects.countries);
        const polys = [];
        countries.features.forEach(feature => {
          const geom = feature.geometry;
          const rings = geom.type === 'Polygon'
            ? [geom.coordinates]
            : geom.type === 'MultiPolygon'
              ? geom.coordinates
              : [];
          rings.forEach(polygon => {
            polygon.forEach(ring => {
              polys.push(ring); // ring is [[lon,lat], ...]
            });
          });
        });
        setPolygons(polys);
      })
      .catch(() => { /* silently fail */ });
    return () => { cancelled = true; };
  }, []);

  // ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // On mobile, zoom to fit the actual tour locations
  const bounds = useMemo(() => {
    if (isMobile && locations.length > 0) {
      return computeMobileBounds(locations);
    }
    return DESKTOP_BOUNDS;
  }, [isMobile, locations]);

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !polygons) return;
    const { width, height } = canvasSize;
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, width, height);

    // Draw country outlines as smooth stroked paths
    ctx.strokeStyle = 'rgba(180, 180, 180, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.lineJoin = 'round';

    polygons.forEach(ring => {
      // Quick cull: skip rings entirely outside the viewport
      let anyInView = false;
      for (let i = 0; i < ring.length; i++) {
        if (isInView(ring[i][0], ring[i][1], bounds)) { anyInView = true; break; }
      }
      if (!anyInView) return;

      ctx.beginPath();
      let moved = false;
      for (let i = 0; i < ring.length; i++) {
        const [lon, lat] = ring[i];
        // Skip antimeridian-crossing segments
        if (i > 0 && Math.abs(ring[i][0] - ring[i - 1][0]) > 90) {
          moved = false;
          continue;
        }
        const [sx, sy] = projectBounded(lon, lat, width, height, bounds);
        if (!moved) {
          ctx.moveTo(sx, sy);
          moved = true;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();
    });

    // Scanline overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }
  }, [canvasSize, polygons, bounds]);

  // Redraw when canvas size or polygons change
  useEffect(() => {
    drawMap();
  }, [drawMap]);

  // Compute projected dot positions
  const projectedLocations = locations.map(loc => {
    if (loc.lat == null || loc.lng == null) return null;
    if (!isInView(loc.lng, loc.lat, bounds)) return null;
    const [x, y] = projectBounded(loc.lng, loc.lat, canvasSize.width, canvasSize.height, bounds);
    return { ...loc, x, y };
  }).filter(Boolean);

  // Group by cityKey for tooltip multi-date display
  const groupedByCity = {};
  projectedLocations.forEach(loc => {
    const key = loc.cityKey;
    if (!groupedByCity[key]) {
      groupedByCity[key] = { ...loc, dates: [] };
    }
    groupedByCity[key].dates.push({ date: loc.date, ticketUrl: loc.ticketUrl });
  });
  const cityDots = Object.values(groupedByCity);

  const hideTimer = useRef(null);

  const handleDotEnter = (cityKey) => {
    if (!isMobile) {
      if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
      setHighlightedCityKey(cityKey);
    }
  };
  const handleDotLeave = () => {
    if (!isMobile) {
      hideTimer.current = setTimeout(() => setHighlightedCityKey(null), 400);
    }
  };
  const handleDotTap = (cityKey) => {
    if (isMobile) {
      setHighlightedCityKey(prev => prev === cityKey ? null : cityKey);
    }
  };
  const handleTooltipEnter = () => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  };
  const handleTooltipLeave = () => {
    if (!isMobile) {
      hideTimer.current = setTimeout(() => setHighlightedCityKey(null), 400);
    }
  };

  return (
    <div className="radar-map" ref={containerRef}>
      <canvas ref={canvasRef} className="radar-map__canvas" />

      {loading && <div className="radar-map__loading">LOADING TOUR DATA...</div>}

      {!loading && cityDots.map(dot => {
        const isHighlighted = highlightedCityKey === dot.cityKey;
        return (
          <div
            key={dot.cityKey}
            className={`radar-dot${isHighlighted ? ' radar-dot--highlighted' : ''}`}
            style={{ left: dot.x, top: dot.y }}
            onMouseEnter={() => handleDotEnter(dot.cityKey)}
            onMouseLeave={handleDotLeave}
            onClick={() => handleDotTap(dot.cityKey)}
          >
            <div className="radar-dot__ring" />
            <div className="radar-dot__ring radar-dot__ring--second" />
          </div>
        );
      })}

      {!loading && cityDots.map(dot => {
        if (highlightedCityKey !== dot.cityKey) return null;
        return (
          <ClampedTooltip
            key={`tip-${dot.cityKey}`}
            dot={dot}
            containerRef={containerRef}
            onMouseEnter={handleTooltipEnter}
            onMouseLeave={handleTooltipLeave}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  } catch {
    return dateStr;
  }
}
