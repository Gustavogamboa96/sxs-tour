import React, { useState, useEffect, useRef } from 'react';
import RadarMap from './RadarMap';
import TourDatesList from './TourDatesList';
import './TourSection.css';

export default function TourSection({ tourApiUrl, geocodingApiKey }) {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedCityKey, setHighlightedCityKey] = useState(null);
  const geoCache = useRef({});

  useEffect(() => {
    if (!tourApiUrl) return;
    let cancelled = false;

    async function fetchAndGeocode() {
      try {
        const res = await fetch(tourApiUrl);
        const data = await res.json();

        // Worker returns { banner, tourDates: [{ fecha: "dd.mm.yyyy", lugar: "City, Country", ticketLink }] }
        const tourDates = data.tourDates || [];

        // Parse city/country from "lugar" and convert "fecha" (dd.mm.yyyy) to ISO
        const parsed = tourDates.map((r, i) => {
          const parts = r.lugar.split(',').map(s => s.trim());
          const city = parts[0] || '';
          const country = parts.slice(1).join(', ') || '';
          const cityKey = r.lugar.trim();

          // Convert dd.mm.yyyy to yyyy-mm-dd for consistent date handling
          let isoDate = r.fecha;
          const dateParts = r.fecha.split('.');
          if (dateParts.length === 3) {
            isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }

          return { id: String(i), city, country, date: isoDate, rawDate: r.fecha, ticketUrl: r.ticketLink, cityKey, lat: null, lng: null };
        }).filter(r => r.city);

        // Geocode unique cities
        const uniqueCities = [...new Set(parsed.map(r => r.cityKey))];
        if (geocodingApiKey) {
          await Promise.all(uniqueCities.map(async cityKey => {
            if (geoCache.current[cityKey]) return;
            try {
              const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityKey)}&key=${encodeURIComponent(geocodingApiKey)}&limit=1`;
              const geoRes = await fetch(url);
              const geoData = await geoRes.json();
              if (geoData.results && geoData.results.length > 0) {
                const { lat, lng } = geoData.results[0].geometry;
                geoCache.current[cityKey] = { lat, lng };
              }
            } catch { /* skip */ }
          }));
        }

        if (cancelled) return;

        // Attach coordinates
        const final = parsed.map(r => {
          const coords = geoCache.current[r.cityKey];
          return coords ? { ...r, lat: coords.lat, lng: coords.lng } : r;
        });

        setDates(final);
      } catch { /* silently fail */ }
      if (!cancelled) setLoading(false);
    }

    fetchAndGeocode();
    return () => { cancelled = true; };
  }, [tourApiUrl, geocodingApiKey]);

  return (
    <section className="tour-section" id="tour-section">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="tour-section__bg-video"
      >
        <source src="/images/TDNBackgroundWeb.webm" type="video/webm" />
      </video>
      <div className="tour-section__inner">
        <div className="tour-section__map-wrap">
          <RadarMap
            locations={dates}
            highlightedCityKey={highlightedCityKey}
            setHighlightedCityKey={setHighlightedCityKey}
            loading={loading}
          />
        </div>
        <div className="tour-section__dates-wrap">
          <TourDatesList
            dates={dates}
            highlightedCityKey={highlightedCityKey}
            setHighlightedCityKey={setHighlightedCityKey}
          />
        </div>
      </div>
    </section>
  );
}
