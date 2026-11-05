/**
 * FALLA/BOCONÓ x VOLVER A SONAR — configuración central de la campaña.
 *
 * La columna `progreso` del Google Sheet representa el total recaudado;
 * no se suma ningún monto adicional desde la configuración.
 */

const LAUNCH_AT = new Date('2026-11-05T00:00:00-04:00');
const campaignLaunched = Date.now() >= LAUNCH_AT.getTime();
const CONTACT_EMAIL = 'tofukarr@gmail.com';

export const FALLA_BOCONO_CONFIG = {
  fundraising: {
    goalUSD: 25000,
    lastUpdated: '05 NOV 2026',
  },

  links: {
    volverASonar: 'https://somosnexos.org/#p-volver-a-sonar',
    bandcamp: 'https://lavidaboheme.bandcamp.com',
    paypal: 'https://paypal.me/yosoylavidaboheme?locale.x=en_US&country.x=US',
    contact: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Colaboración — Volver a Sonar x FALLA/BOCONÓ')}`,
    festivalTickets: 'https://ticketing.cusica.com/events/125-cusica-festival-nuevas-bandas?_gl=1*6w328*_gcl_au*NTEwMTE3ODQ0LjE3OTM2NDgzOTAuMTM2NDIzNjM2MC4xNzkzNjQ4MzkwLjE3OTM2NDgzODkuMTU1NzI2MDU4NC4xNzkzNjQ4MzkwLjE3OTM2NDgzODk',
    valenciaTickets: 'https://room.b9ticketing.com/boletos/aforo/6ac6a3bb53bd3f999585d78f?fbclid=PAVERFWAVVyFlleHRuA2FlbQIxMQBwZG9mAmZkaWQWURfrfH56oc5DfEXiE8RZ-B3fLqMz-nNydGMGYXBwX2lkDzEyNDAyNDU3NDI4NzQxNAABp5uPiCYLRocTOlebAI8fCvSvEC-zoTf-_5R0n4C-cTCobYIu6t8kslLiqTcc_aem_WofJmrmcWCBAlllTXeKw4A',
    projectManager: 'Stephanie Carreira',
  },

  // Ubicación del puntero de la campaña en el radar (La Guaira / Caracas)
  pointer: {
    lat: 10.6018,
    lng: -66.9322,
  },

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
    { id: 'staff', label: 'Staff / apoyo operativo', amountUSD: 980 },
    { id: 'management', label: 'Gastos de gestión del proyecto', amountUSD: 453 },
  ],

  // Formas de ayudar — el orden define la prioridad visual
  ways: [
    {
      id: 'bandcamp',
      title: 'FALLA/BOCONÓ en Bandcamp',
      short: 'Compra el EP en Bandcamp',
      audience: 'Para quien quiere la música',
      price: 'Desde US$14',
      priceNote: 'Exclusivo en Bandcamp',
      body: campaignLaunched
        ? 'Desde el estreno del 5 de noviembre, puedes apoyar Volver a Sonar adquiriendo FALLA/BOCONÓ en Bandcamp. Al comprar, recibes acceso de inmediato a AM / FM y a las siguientes canciones conforme se alcancen los hitos de recaudación. El EP completo queda liberado al alcanzar US$25.000. US$14 es el aporte mínimo, pero puedes contribuir con una cantidad mayor si lo deseas.'
        : 'A partir del 5 de noviembre, podrás apoyar Volver a Sonar adquiriendo FALLA/BOCONÓ en preventa. Al comprar, recibirás acceso a AM / FM, el primer tema disponible, a partir de su lanzamiento, y a las siguientes canciones conforme se alcancen los hitos de recaudación. El EP completo quedará liberado al alcanzar US$25.000. US$14 es el aporte mínimo, pero puedes contribuir con una cantidad mayor si lo deseas.',
      cta: 'Comprar en Bandcamp',
      linkKey: 'bandcamp',
      external: true,
      featured: true,
    },
    {
      id: 'sponsor',
      title: 'Patrocina a un músico',
      short: 'Patrocina a un músico',
      audience: 'Para un impacto directo',
      price: 'Desde US$492',
      priceNote: 'Aporte orientativo al fondo común',
      body:
        'Este monto representa una aproximación del costo promedio de atender las necesidades diagnosticadas por músico, considerando instrumentos, reparaciones, kits de continuidad y apoyo operativo. Tu aportación se integra al fondo común para cubrir las necesidades prioritarias de la orquesta; los recursos no se reparten necesariamente por igual.',
      cta: 'Proponer un aporte',
      linkKey: 'paypal',
      external: true,
    },
    {
      id: 'merch',
      title: 'Merch con causa',
      short: 'Merch con causa',
      audience: 'En actividades en Venezuela',
      price: '20% de las ventas',
      priceNote: 'Destinado a Volver a Sonar',
      body:
        'Durante las actividades de La Vida Bohème en Venezuela, el 20% de las ventas de merchandising se destinará a Volver a Sonar. Si vas a asistir al Festival Nuevas Bandas el domingo 8 de noviembre o al show de La Vida Bohème en Valencia el 14 de noviembre, también podrás apoyar la causa adquiriendo merch durante estos eventos.',
      cta: 'Ver entradas',
      ticketLinks: [
        { label: 'Festival Nuevas Bandas', linkKey: 'festivalTickets' },
        { label: 'Show Valencia', linkKey: 'valenciaTickets' },
      ],
    },
    {
      id: 'collaborate',
      title: 'Colabora de otra manera',
      short: 'Empresas y aliados',
      audience: 'Empresas, medios y aliados',
      price: 'Aporte abierto',
      priceNote: 'Económico, en especie o difusión',
      body:
        '¿Representas a una empresa, medio de comunicación, organización o eres creador de contenido? Puedes sumarte a Volver a Sonar mediante aportes económicos, donaciones en especie (instrumentos, materiales, equipos o servicios), difusión o colaboraciones que contribuyan a ampliar el alcance de la iniciativa. Cuéntanos cómo te gustaría participar y exploremos juntos las posibilidades de colaboración.',
      cta: 'Proponer una colaboración',
      linkKey: 'contact',
    },
  ],

  tracklist: [
    { num: '01', title: 'Golpe de Estado', unlockUSD: 10000 },
    { num: '02', title: 'Péscalo', feat: 'Orestes Gómez', unlockUSD: 5000 },
    { num: '03', title: 'AM / FM', unlockUSD: 0, releaseAt: LAUNCH_AT },
    { num: '04', title: 'Track 4', unlockUSD: 10000 },
    { num: '05', title: 'Track 5', unlockUSD: 10000 },
    { num: '06', title: 'Track 6', unlockUSD: 15000 },
    { num: '07', title: 'Track 7', unlockUSD: 15000 },
    { num: '08', title: 'Track 8', unlockUSD: 20000 },
    { num: '09', title: 'Track 9', unlockUSD: 25000 },
  ],

  releaseMilestones: [
    { amountUSD: 0, count: 1, tracks: ['AM / FM'] },
    { amountUSD: 5000, count: 2, tracks: ['Péscalo'] },
    { amountUSD: 10000, count: 5, tracks: ['Golpe de Estado', 'Track 4', 'Track 5'] },
    { amountUSD: 15000, count: 7, tracks: ['Track 6', 'Track 7'] },
    { amountUSD: 20000, count: 8, tracks: ['Track 8'] },
    { amountUSD: 25000, count: 9, tracks: ['Track 9'] },
  ],

  focusStories: [
    {
      id: 'amfm',
      title: 'AM / FM',
      meta: ['Primer tema disponible · 5 de noviembre'],
      body:
        'Nació de años de viaje, vivió en una laptop hasta este verano y se terminó en el estudio de la banda en Ciudad de México. Es la resolución más apacible del EP para atraer escuchas.',
      image: '/images/falla-bocono/amfm-cover.png',
      imageAlt: 'Portada de FALLA/BOCONÓ · La Vida Bohème',
      squareImage: true,
      unlockUSD: 0,
      audioUrl: '',
      visualizerUrl: '',
    },
    {
      id: 'pescalo',
      title: 'Péscalo',
      meta: ['Feat. Orestes Gómez'],
      body:
        'Empezó como una pieza electrónica. Después del terremoto se convirtió en una pieza de tambores tradicionales, con Orestes Gómez y el maestro Félix Bemba. Es el punto donde el disco, el oficio y Volver a Sonar se tocan.',
      image: '/images/falla-bocono/focus-pescalo.jpg',
      unlockUSD: 5000,
    },
    {
      id: 'golpe',
      title: 'Golpe de Estado',
      meta: [],
      body:
        'Nació en las sesiones de Tierra de Nadie en Montgomery, NY en 2024, y se retomó después en Ciudad de México. Explora la identidad y el trauma desde preguntas, no desde respuestas.',
      image: '/images/falla-bocono/focus-golpe.jpg',
      unlockUSD: 10000,
    },
  ],

  howWeAreDoing: {
    intro: 'Cada aporte se convierte en acciones concretas para que la música pueda seguir sonando.',
    entries: [],
  },

  contributors: [
    {
      id: 'organization',
      title: 'Organización y ejecución de la causa',
      people: [
        {
          name: 'Nexos',
          role: 'Organización que impulsa y articula Volver a Sonar, coordinando los esfuerzos y recursos destinados a la campaña.',
          link: 'https://nexosdonaciones.netlify.app/',
        },
        { name: 'Ler Rosell', role: 'Coordinación de Volver a Sonar y representación de Nexos.' },
        {
          name: 'Orquesta Sinfónica Gran Mariscal de Ayacucho',
          role: 'Organización beneficiaria de esta primera etapa, destinada a recuperar instrumentos, materiales y herramientas esenciales para la continuidad del trabajo musical.',
          link: 'https://www.instagram.com/sinfonicayacucho/',
        },
        { name: 'Eugenia Vegas', role: 'Representante de la Orquesta y enlace con los músicos beneficiarios.' },
        {
          name: 'Ayacucho Symphony Orchestra Foundation Inc.',
          role: 'Entidad receptora de los donativos económicos destinados a la causa.',
        },
      ],
    },
    {
      id: 'music',
      title: 'Música y dirección del proyecto',
      people: [
        {
          name: 'La Vida Bohème',
          role: 'Impulsa FALLA/BOCONÓ como vehículo musical de recaudación y visibilidad para Volver a Sonar.',
          link: 'https://yosoylavidaboheme.com/',
        },
        {
          name: 'Stephanie Carreira',
          role: 'Project Management y estrategia de FALLA/BOCONÓ, incluyendo la coordinación de iniciativas y aliados vinculados a la campaña.',
        },
        { name: 'Gustavo Gamboa', 
          role: 'Software Engineer. Amigo de La Vida Bohème y colaborador en el proyecto FALLA/BOCONÓ.', 
          link: 'https://gustra.codes/' 
        },
      ],
    },
    {
      id: 'production',
      title: 'Producción, comunicación y aliados',
      people: [
        {
          name: 'Capitolio',
          role: 'Coproducción y colaboración en el registro audiovisual y la documentación del proyecto.',
          link: 'https://capitolio.co/',
          contact: 'Andrés Figueredo — Representante de Capitolio y enlace para la coordinación audiovisual.',
        },
        {
          name: 'Clarissa Páez',
          role: 'Relaciones públicas y coordinación de agenda de La Vida Bohème durante Latin GRAMMY Week.',
          link: 'https://www.instagram.com/cp_musicmarketing',
        },
        {
          name: 'Luanda Caleca',
          role: 'Relaciones públicas, prensa y coordinación de agenda de La Vida Bohème en Venezuela.',
          link: 'https://www.instagram.com/luandacaleca/',
        },
        {
          name: 'Yerba',
          role: 'Colaboración en las iniciativas de merchandising de La Vida Bohème vinculadas a la recaudación de Volver a Sonar.',
          link: 'https://yerbayork.com/',
        },
        {
          name: '19/86 Entertainment',
          role: 'Colaboración en la gestión artística y coordinación de las actividades de La Vida Bohème.',
          link: 'https://www.instagram.com/1986mgmt/',
        },
      ],
    },
    {
      id: 'thanks',
      title: 'Gracias a quienes ya se sumaron',
      lists: [
        {
          title: 'Músicos e invitados de FALLA/BOCONÓ',
          description: 'Gracias por sumar su talento y creatividad a esta obra.',
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
          title: 'Maestros luthiers',
          description: 'Gracias por aportar su oficio y conocimiento a la recuperación de los instrumentos que permiten que la música continúe.',
          names: ['Ricardo Parra', 'José Alexander Suárez', 'Ángel García', 'Víctor Urrieta'],
        },
      ],
      cta: 'Quiero sumarme',
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

// Monto en vivo (Google Sheet). null = todavía no hay un total disponible.
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
  const { goalUSD, lastUpdated } = FALLA_BOCONO_CONFIG.fundraising;
  const raisedUSD = liveRaisedUSD ?? 0;
  const ratio = goalUSD > 0 ? Math.min(1, Math.max(0, raisedUSD / goalUSD)) : 0;
  return {
    goalUSD,
    raisedUSD,
    lastUpdated,
    ratio,
    percent: Math.floor(ratio * 1000) / 10,
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
