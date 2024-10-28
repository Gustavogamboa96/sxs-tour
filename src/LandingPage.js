import React from 'react';
import './LandingPage.css';



const links = [
    { href: 'https://www.youtube.com/@lavidabohemev0', text: 'http://youtube.com' },
    { href: 'https://open.spotify.com/artist/5gs7iemsrjIJbz0ryFcy79', text: 'http://spotify.com' },
    { href: 'https://lavidaboheme.bandcamp.com/', text: 'http://bandcamp.com' },
    { href: 'https://www.instagram.com/lavidaboheme/', text: 'http://instagram.com'},
    { href: 'mailto:management@yosoylavidaboheme.com', text: 'http://contacto.com' },
  ];

const events = [
  {
    date: 'Sep.19',
    city: 'Cuautitlan Izcalli, Mex',
    venue: 'The Shamrock',
    link: 'https://www.passline.com/eventos/la-vida-boheme-en-cuautitlan-izcalli',
  },
  {
    date: 'Sep.20',
    city: 'Puebla, Mex',
    venue: ' ... ...Beat 803',
    link: 'https://www.passline.com/eventos/la-vida-boheme-en-puebla-pue',
  },
  {
    date: 'Sep.21',
    city: 'Toluca, Mex',
    venue: ' ... ... Foro Lando',
    link: 'https://www.passline.com/eventos/la-vida-boheme-en-toluca',
  },
  {
    date: 'Sep.28',
    city: 'Monterrey, Mex',
    venue: ' ...Metapatio',
    link: 'https://www.passline.com/eventos/la-vida-boheme-en-monterrey',
  },
  {
    date: 'Oct.04',
    city: 'Leon, Mex',
    venue: ' ... ... ...Llamarada',
    link: 'https://www.passline.com/eventos/la-vida-boheme-en-leon-guanajuato',
  },
  {
    date: 'Oct.05',
    city: 'Guadalajara, Mex',
    venue: ' .Cuerda',
    link: 'https://www.passline.com/eventos/la-vida-boheme-en-guadalajara-jalisco',
  },
  {
    date: 'Oct.19',
    city: 'CDMX',
    venue: ' ... ... ... ... .Foro La Paz',
    link: 'https://www.passline.com/eventos/la-vida-boheme-sangre-x-sangre-tour-cdmx',
  },
  {
    date: 'Oct.12',
    city: 'Madrid, España',
    venue: ' ... La Sala',
    link: 'https://www.passline.com/eventos/la-vida-boheme-live-madrid-sangrexsangre-tour-2024',
  },
  {
    date: 'Oct.13',
    city: 'Barcelona, España',
    venue: ' Razzmatazz',
    link: 'https://www.passline.com/eventos/la-vida-boheme-live-barcelona-sangrexsangre-tour-2024',
  },
  {
    date: 'Oct.15',
    city: 'Berlin, Alemania',
    venue: ' ...Lido',
    link: 'https://www.passline.com/eventos/la-vida-boheme-live-berlin-sangrexsangre-tour-2024',
  },
  {
    date: 'Oct.17',
    city: 'Londres, UK',
    venue: ' ... ... ..Oslo',
    link: 'https://www.passline.com/eventos/la-vida-boheme-live-londres-sangrexsangre-tour2024',
  },
  {
    date: '2025.. ',
    city: 'Lima, Peru',
    venue: ' ... ... TBD',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSe678XwGTB6yZ0Izk9_iJaYvZ3uuYmc2_6ju5yrZpraOlZojQ/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaapFEEMdGXMIEogssMEVbQs2m4EbyzXrVbRrj67oGgrvATKR_yVKSGgomQ_aem_iRFbFFm0c9D1tMwgOS67zg&pli=1',
  },
  {
    date: 'Oct.23',
    city: 'Santiago, Chile',
    venue: ' ..Club Chocolate',
    link: 'https://www.passline.com/eventos/la-vida-boheme-live-santiago-sangrexsangre-tour-2024',
  },
  {
    date: 'Oct.24',
    city: 'Buenos Aires, Argentina',
    venue: 'Groove',
    link: 'https://www.passline.com/eventos/la-vida-boheme-live-buenos-aires-sangrexsangre-tour-2024',
  },
  {
    date: 'Oct.26',
    city: 'Bogotá, Colombia',
    venue: 'Ace of Spades',
    link: 'https://www.passline.com/eventos/la-vida-boheme-live-bogota-sangrexsangre-tour-2024',
  },
  {
    date: 'Dec.20',
    city: 'Miami, Florida',
    venue: 'ZeyZey',
    link: 'https://shotgun.live/en/events/zey-zey-presents-chromeo-dj-set-2?utm_source=la-vida-boheme',
  },
];



const LandingPage = () => {
//     const [scrollingProgress, setScrollingProgress] = useState(0);
  
  
//   useEffect(() => {
//     const handleScroll = () => {
//         const scrollTop = document.body.scrollTop;
//         const docHeight = document.body.scrollHeight ;
//         const winHeight = window.innerHeight;
//         const scrollPercent = (scrollTop / (docHeight-winHeight)) * 100;
//         setScrollingProgress(scrollPercent);
        
        
//       };
//     window.addEventListener('scroll', handleScroll);
      
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
//     console.log(scrollingProgress);

  return (
    <div>
        {/* <div className="progress-container">
      <div
        className="progress-bar"
        style={{ height: `${scrollingProgress}%` }}
      ></div>
    </div> */}
    <div className="landing-page background-section animated-cursor">
      
      
    </div>
    <div className="content animated-cursor">
        {events.map((event, index) => (
          <a key={index} href={event.link} target="_blank" rel="noopener noreferrer">
            <div className="event">
              <p>{event.date}... ... ... ...{event.city}... ... ...{event.venue}</p>
            </div>
          </a>
        ))}
        <div className="footer">
        {links.map((link, index) => (
          <a key={index} href={link.href}>
            {link.text}
          </a>
        ))}
      </div>
      </div>
    </div>
  );
};

export default LandingPage;
