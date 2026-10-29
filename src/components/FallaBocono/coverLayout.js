/**
 * Shared geometry for the FALLA/BOCONÓ cover poster.
 * Used by the DOM cover (CSS custom properties) and by the WebGL paper
 * texture, so the uncrumpled sheet lands exactly on top of the real page.
 */
export const COVER_IMAGES = {
  wide: '/images/falla-bocono/concrete-wide.jpg',
  tall: '/images/falla-bocono/concrete-tall.jpg',
};

export const COVER_COLORS = {
  base: '#8c8984',
  cream: '#f4f1ea',
  rust: '#7a2e2e',
};

// All sizes are fractions of S = min(viewportWidth, viewportHeight * 1.6)
export const COVER = {
  left: 0.065, // of width
  top: 0.38, // of height
  eyebrowSize: 0.024,
  eyebrowTracking: 0.42, // em
  titleSize: 0.112,
  titleGap: 0.012,
  lvbSize: 0.046,
  lvbRight: 0.09, // of width
  lvbBottom: 0.2, // of height
  narrowBreakpoint: 700,
  indent: 0.085, // of width, desktop only
  titleEm: 8.05, // measured width of "FALLA/BOCONÓ" in em (opsz 24, wght 500)
};

export function coverMetrics(w, h) {
  const S = Math.min(w, h * 1.6);
  const narrow = w < COVER.narrowBreakpoint;
  const left = w * COVER.left;
  const indent = narrow ? 0 : w * COVER.indent;
  const fitSize = (w - left * 2 - indent) / COVER.titleEm;
  const titleSize = Math.min(S * (narrow ? COVER.titleSize * 1.04 : COVER.titleSize), fitSize);
  return {
    S,
    narrow,
    left,
    top: h * COVER.top,
    eyebrowSize: S * (narrow ? COVER.eyebrowSize * 1.45 : COVER.eyebrowSize),
    titleSize,
    titleGap: S * COVER.titleGap,
    indent,
    lvbSize: S * (narrow ? COVER.lvbSize * 1.5 : COVER.lvbSize),
    lvbRight: w * COVER.lvbRight,
    lvbBottom: h * COVER.lvbBottom,
  };
}

export function coverStyleVars(w, h) {
  const m = coverMetrics(w, h);
  return {
    '--cv-left': `${m.left}px`,
    '--cv-top': `${m.top}px`,
    '--cv-eyebrow': `${m.eyebrowSize}px`,
    '--cv-title': `${m.titleSize}px`,
    '--cv-gap': `${m.titleGap}px`,
    '--cv-indent': `${m.indent}px`,
    '--cv-lvb': `${m.lvbSize}px`,
    '--cv-lvb-right': `${m.lvbRight}px`,
    '--cv-lvb-bottom': `${m.lvbBottom}px`,
  };
}

/**
 * Canvas 2D can't set optical size, so the cover uses static Bodoni Moda
 * instances registered as their own family. DOM and WebGL texture then
 * render identical glyphs. Upright opsz 24 / italic opsz 11 at weight 500
 * keep the hairlines readable (must match DISPLAY_OPSZ in the page CSS).
 */
export const COVER_FONT = '"Bodoni Cover", "Bodoni Moda", "Playfair Display", serif';
export const COVER_WEIGHT = 500;
const COVER_FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,24,500;1,11,500&display=swap';

let coverFontPromise = null;
export function ensureCoverFont() {
  if (coverFontPromise) return coverFontPromise;
  if (typeof document === 'undefined' || !document.fonts || typeof FontFace === 'undefined') {
    coverFontPromise = Promise.resolve(false);
    return coverFontPromise;
  }
  coverFontPromise = fetch(COVER_FONT_CSS)
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(r.status))))
    .then((css) => {
      const faces = [];
      css.replace(/@font-face\s*{([^}]*)}/g, (_, body) => {
        const src = body.match(/url\(([^)]+)\)/);
        if (!src) return '';
        const style = (body.match(/font-style:\s*(\w+)/) || [])[1] || 'normal';
        const range = (body.match(/unicode-range:\s*([^;]+);/) || [])[1];
        const face = new FontFace('Bodoni Cover', `url(${src[1]})`, {
          style,
          weight: String(COVER_WEIGHT),
          ...(range ? { unicodeRange: range.trim() } : {}),
        });
        document.fonts.add(face);
        faces.push(face);
        return '';
      });
      return Promise.all([
        document.fonts.load(`${COVER_WEIGHT} 64px "Bodoni Cover"`, 'FALLA/BOCONÓ LA VIDA BOHÈME'),
        document.fonts.load(`italic ${COVER_WEIGHT} 32px "Bodoni Cover"`, 'VOLVER A SONAR ×'),
      ]).then(() => faces.length > 0);
    })
    .catch(() => false);
  return coverFontPromise;
}
