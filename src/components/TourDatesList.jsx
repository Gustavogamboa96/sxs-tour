import React, { useEffect, useState } from 'react';

export default function TourDatesList({ dates, highlightedCityKey, setHighlightedCityKey }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleEnter = (cityKey) => {
    if (!isMobile) setHighlightedCityKey(cityKey);
  };
  const handleLeave = () => {
    if (!isMobile) setHighlightedCityKey(null);
  };
  const handleTap = (cityKey) => {
    if (isMobile) {
      setHighlightedCityKey(prev => prev === cityKey ? null : cityKey);
    }
  };

  const handleClick = (ticketUrl) => {
    window.open(ticketUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="tour-dates-list">
      <div className="tour-dates-list__scroll">
        {dates.map(d => {
          const isHighlighted = highlightedCityKey === d.cityKey;
          return (
            <button
              key={d.id}
              className={`tour-date-btn${isHighlighted ? ' tour-date-btn--highlighted' : ''}`}
              onMouseEnter={() => handleEnter(d.cityKey)}
              onMouseLeave={handleLeave}
              onClick={() => {
                if (isMobile) {
                  handleTap(d.cityKey);
                } else {
                  handleClick(d.ticketUrl);
                }
              }}
            >
              <span className="tour-date-btn__city">{d.city}</span>
              <span className="tour-date-btn__country">{d.country}</span>
              <span className="tour-date-btn__date">{d.rawDate}</span>
              <span className="tour-date-btn__tickets">TICKETS →</span>
            </button>
          );
        })}
      </div>
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
