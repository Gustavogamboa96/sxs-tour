/**
 * Shared geometry for the FALLA/BOCONÓ cover poster.
 * Shared image sizing; the WebGL paper uses the rendered cover bounds
 * to match its responsive vertical alignment.
 */
export const COVER_IMAGES = {
  background: '/images/falla-bocono/hero-grey.png',
  logo: '/images/falla-bocono/hero-logo-black.png',
};

export const COVER_COLORS = {
  base: '#AAAAAA',
};

const LOGO_ASPECT = 2604 / 705;

export function coverMetrics(w, h) {
  const left = w * 0.065;
  const logoWidth = Math.min(w - left * 2, h * 0.4 * LOGO_ASPECT);
  return {
    left,
    logoLeft: (w - logoWidth) / 2,
    logoTop: Math.max(84, h * 0.12),
    logoWidth,
    logoHeight: logoWidth / LOGO_ASPECT,
  };
}

export function coverStyleVars(w, h) {
  const m = coverMetrics(w, h);
  return {
    '--cv-left': `${m.left}px`,
    '--cv-logo-height': `${m.logoHeight}px`,
    '--cv-logo-width': `${m.logoWidth}px`,
    '--cv-background': `url("${COVER_IMAGES.background}")`,
  };
}
