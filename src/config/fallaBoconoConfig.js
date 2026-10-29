/**
 * FALLA/BOCONÓ x VOLVER A SONAR — configuración central de la campaña.
 *
 * Barra de progreso (radar + página de la campaña):
 *   - En vivo: columna `progreso` del Google Sheet de fechas (vía el worker de /tour).
 *     Escribe el monto neto recaudado en USD (ej. 5000). Tarda hasta ~10 min en reflejarse.
 *   - Respaldo: si el sheet no tiene valor, se usan `fundraising.raisedUSD` y `lastUpdated`.
 *
 * Contacto: deja CONTACT_EMAIL vacío para ocultar los correos y botones de contacto.
 */

const CONTACT_EMAIL = '';

function mailto(subject) {
  return CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}` : null;
}

export const FALLA_BOCONO_CONFIG = {
  fundraising: {
    goalUSD: 25000,
    raisedUSD: 0,
    lastUpdated: '29 OCT 2026',
  },

  links: {
    bandcamp: 'https://lavidaboheme.bandcamp.com',
    sponsorMusician: mailto('Patrocinio de un músico — Volver a Sonar'),
    merch: 'https://yerbayork.com/',
    collaborate: mailto('Colaboración — Volver a Sonar x FALLA/BOCONÓ'),
    contact: mailto('FALLA/BOCONÓ x VOLVER A SONAR'),
    projectManager: 'Stephanie Carreira',
  },

  // Ubicación del puntero amarillo en el radar (La Guaira / Caracas)
  pointer: {
    lat: 10.6018,
    lng: -66.9322,
  },

  heroStats: [
    { value: '05 NOV', label: 'Lanzamiento' },
    { value: '1 EP', label: 'FALLA/BOCONÓ' },
    { value: 'US$25K', label: 'Meta neta' },
    { value: '51', label: 'Kits de continuidad' },
    { value: '51', label: 'Músicos de la orquesta' },
  ],

  context: {
    members: 68,
    affectedHomes: 32,
    severeDamage: 8,
    musiciansInNeed: 51,
    damageUSD: 24547,
  },

  // Etapa 1 — desglose del diagnóstico
  breakdown: [
    { id: 'instruments', label: 'Necesidades específicas de instrumentos', amountUSD: 9860 },
    { id: 'kits', label: 'Kits de continuidad', amountUSD: 7878 },
    { id: 'repairs', label: 'Reparaciones', amountUSD: 5829 },
    { id: 'staff', label: 'Staff', amountUSD: 980 },
  ],

  // Fotos de instrumentos afectados. Asigna `image` (ej. '/images/falla-bocono/arpa.jpg').
  instrumentPhotos: [
    { id: 'arpa', label: 'Arpa', image: null },
    { id: 'xilofono', label: 'Xilófono', image: null },
    { id: 'clavijero', label: 'Clavijero de contrabajo', image: null },
    { id: 'caja', label: 'Caja de violonchelo / contrabajo', image: null },
  ],

  // Formas de ayudar — el orden define la prioridad visual
  ways: [
    {
      id: 'bandcamp',
      title: 'Escucha y apoya FALLA/BOCONÓ',
      short: 'Compra el EP en Bandcamp',
      audience: 'Para quien quiere la música',
      price: 'Desde US$10',
      priceNote: 'Exclusivo en Bandcamp',
      body:
        'El 5 de noviembre, La Vida Bohème abre la preventa de FALLA/BOCONÓ exclusivamente en Bandcamp. Al comprar, recibirás acceso inmediato a AM/FM, la primera canción disponible, y a la obra completa cuando esté terminada y se alcance la meta de recaudación. Recuerda que $10 es la donación mínima, pero puedes pagar más si lo deseas.',
      cta: 'Comprar FALLA/BOCONÓ',
      linkKey: 'bandcamp',
      external: true,
      featured: true,
    },
    {
      id: 'sponsor',
      title: 'Patrocina a un músico',
      short: 'Patrocina a un músico',
      audience: 'Para un impacto directo',
      price: 'US$492 o más',
      priceNote: 'Incluye código de descarga',
      body:
        'Tu aporte se suma al fondo destinado a herramientas, reparaciones y continuidad del trabajo musical de la orquesta. Quienes participen en esta modalidad también podrán recibir un código de descarga de FALLA/BOCONÓ en Bandcamp, el cual será enviado de manera personalizada una vez confirmado el donativo.',
      cta: 'Patrocinar a un músico',
      linkKey: 'sponsorMusician',
    },
    {
      id: 'merch',
      title: 'Merch con causa',
      short: 'Merch con causa',
      audience: 'En los shows en Venezuela',
      price: '20% de las ventas',
      priceNote: 'Destinado a Volver a Sonar',
      body:
        'Durante las actividades participantes de La Vida Bohème en Venezuela, una parte de las ventas de merch (en alianza con Yerba) se destinará a la campaña. Conoce los productos y descubre dónde podrás adquirirlos.',
      cta: 'Conocer el merch',
      linkKey: 'merch',
      external: true,
    },
    {
      id: 'collaborate',
      title: 'Colabora de otra manera',
      short: 'Empresas y aliados',
      audience: 'Empresas, medios y aliados',
      price: 'Aporte abierto',
      priceNote: 'Económico, en especie o difusión',
      body:
        '¿Representas a una empresa, un medio, una organización o eres creador de contenido? También puedes apoyar mediante aportes económicos, donaciones en especie (instrumentos, insumos, equipos, servicios), difusión o colaboraciones que ayuden a ampliar el alcance de la iniciativa.',
      cta: 'Quiero colaborar',
      linkKey: 'collaborate',
    },
  ],

  tracklist: [
    { num: '01', title: 'Cambur Pintón' },
    { num: '02', title: 'El Salvador' },
    { num: '03', title: 'Golpe de Estado' },
    { num: '04', title: 'Péscalo', feat: 'Orestes Gómez' },
    { num: '05', title: 'AM/FM', available: true },
  ],

  focusStories: [
    {
      id: 'amfm',
      title: 'AM/FM',
      meta: ['Focus track', 'Visualizer 05 NOV'],
      body:
        'Nació de años de viaje, vivió en una laptop hasta este verano y se terminó en el estudio de la banda en Ciudad de México. Es la resolución más apacible del EP para atraer escuchas.',
      image: '/images/falla-bocono/focus-amfm.jpg',
    },
    {
      id: 'pescalo',
      title: 'Péscalo',
      meta: ['Feat. Orestes Gómez'],
      body:
        'Empezó como una pieza electrónica. Después del terremoto se convirtió en una pieza de tambores tradicionales, con Orestes Gómez y el maestro Félix Bemba. Es el punto donde el disco, el oficio y Volver a Sonar se tocan.',
      image: '/images/falla-bocono/focus-pescalo.jpg',
    },
    {
      id: 'golpe',
      title: 'Golpe de Estado',
      meta: [],
      body:
        'Nació en las sesiones de Tierra de Nadie en Montgomery, NY en 2024, y se retomó después en Ciudad de México. Explora la identidad y el trauma desde preguntas, no desde respuestas.',
      image: '/images/falla-bocono/focus-golpe.jpg',
    },
  ],

  partners: [
    {
      id: 'nexos',
      name: 'Nexos',
      role: 'Organiza y articula Volver a Sonar.',
      contact: { name: 'Ler Rosell', email: '' },
    },
    {
      id: 'ayacucho',
      name: 'Orquesta Sinfónica Gran Mariscal de Ayacucho',
      role: 'Comunidad beneficiaria de esta primera etapa, junto a Ayacucho Symphony Orchestra Foundation Inc. como receptor de donativos.',
      contact: { name: 'Eugenia Vegas', email: '' },
    },
    {
      id: 'lvb',
      name: 'La Vida Bohème',
      role: 'Participa a través de FALLA/BOCONÓ y distintas acciones de recaudación y comunicación.',
    },
    {
      id: 'capitolio',
      name: 'Capitolio',
      role: 'Acompaña la coproducción y el registro audiovisual del proyecto.',
    },
  ],

  // Muro de agradecimientos — agrega nombres o categorías nuevas aquí
  acknowledgements: [
    {
      category: 'Músicos e invitados del EP',
      names: [
        'Orestes Gómez',
        'Maestro Félix Bemba',
        'John Naclerio',
        'Habish Rosario',
        'Luis Daniel González',
        'Margarett Álvarez',
        'Santiago Warapo',
      ],
    },
    {
      category: 'Maestros luthiers',
      names: ['Ricardo Parra', 'José Alexander Suárez', 'Ángel García', 'Víctor Urrieta'],
    },
    {
      category: 'Aliados',
      names: ['Festival Nuevas Bandas', 'Yerba', '19/86 Entertainment'],
    },
  ],
};

/**
 * Acepta números o texto del sheet: "5000", "5.000", "5,000", "US$ 5.000,50".
 */
export function parseAmount(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : null;
  if (typeof value !== 'string') return null;
  let s = value.replace(/[^\d.,]/g, '');
  if (!s) return null;
  const dot = s.lastIndexOf('.');
  const comma = s.lastIndexOf(',');
  if (dot > -1 && comma > -1) {
    const dec = dot > comma ? '.' : ',';
    s = s.split(dec === '.' ? ',' : '.').join('').replace(dec, '.');
  } else if (dot > -1 || comma > -1) {
    const parts = s.split(dot > -1 ? '.' : ',');
    const thousands = parts.length > 2 || parts[parts.length - 1].length === 3;
    s = thousands ? parts.join('') : parts.join('.');
  }
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

// Monto en vivo (Google Sheet). null = usar el respaldo de arriba.
let liveRaisedUSD = null;
let progressVersion = 0;
const progressListeners = new Set();

export function setLiveRaisedUSD(value) {
  const next = parseAmount(value);
  if (next === liveRaisedUSD) return;
  liveRaisedUSD = next;
  progressVersion += 1;
  progressListeners.forEach((fn) => fn());
}

export function subscribeFundraising(fn) {
  progressListeners.add(fn);
  return () => progressListeners.delete(fn);
}

export function getFundraisingVersion() {
  return progressVersion;
}

export function getFundraisingProgress() {
  const { goalUSD, raisedUSD: fallbackRaised, lastUpdated } = FALLA_BOCONO_CONFIG.fundraising;
  const live = liveRaisedUSD !== null;
  const raisedUSD = live ? liveRaisedUSD : fallbackRaised;
  const ratio = goalUSD > 0 ? Math.min(1, Math.max(0, raisedUSD / goalUSD)) : 0;
  return {
    goalUSD,
    raisedUSD,
    lastUpdated: live ? null : lastUpdated,
    ratio,
    percent: Math.floor(ratio * 100),
    remainingUSD: Math.max(0, goalUSD - raisedUSD),
  };
}

export function formatUSD(amount) {
  return `US$${Math.round(amount).toLocaleString('es-VE')}`;
}

export function formatUSDShort(amount) {
  if (amount < 1000) return formatUSD(amount);
  const k = Math.round(amount / 100) / 10;
  return `US$${k.toLocaleString('es-VE', { maximumFractionDigits: 1 })}K`;
}
