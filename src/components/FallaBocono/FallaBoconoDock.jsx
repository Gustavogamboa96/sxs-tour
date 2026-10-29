import React, { useState } from 'react';
import GoalProgress from './GoalProgress';
import useFundraisingProgress from './useFundraisingProgress';
import './FallaBoconoDock.css';

const STORAGE_KEY = 'fb-dock-min';

export default function FallaBoconoDock({ onOpen }) {
  const [minimized, setMinimized] = useState(() => {
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });
  const { percent } = useFundraisingProgress();

  const setMin = (value) => {
    setMinimized(value);
    try { sessionStorage.setItem(STORAGE_KEY, value ? '1' : '0'); } catch { /* ignore */ }
  };

  const open = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onOpen?.({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  if (minimized) {
    return (
      <div className="fb-dock-pill">
        <button type="button" className="fb-dock-pill__open" onClick={open}>
          <span className="fb-dock__blink" aria-hidden="true" />
          <span>FALLA/BOCONÓ</span>
          <span className="fb-dock-pill__pct">{percent}%</span>
        </button>
        <button
          type="button"
          className="fb-dock-pill__expand"
          onClick={() => setMin(false)}
          aria-label="Expandir panel de la campaña"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <aside className="fb-dock" aria-label="Campaña FALLA/BOCONÓ × Volver a Sonar">
      <div className="fb-dock__head">
        <span className="fb-dock__blink" aria-hidden="true" />
        <span className="fb-dock__channel">TRANSMISIÓN ENTRANTE</span>
        <button
          type="button"
          className="fb-dock__min"
          onClick={() => setMin(true)}
          aria-label="Minimizar panel de la campaña"
        >
          –
        </button>
      </div>

      <button type="button" className="fb-dock__body" onClick={open}>
        <span className="fb-dock__title">
          FALLA<span className="fb-dock__slash">/</span>BOCONÓ
          <span className="fb-dock__x"> × </span>
          <span className="fb-dock__vas">VOLVER A SONAR</span>
        </span>
        <span className="fb-dock__sub">Apoya a 51 músicos de la Orquesta Sinfónica Gran Mariscal de Ayacucho</span>
        <GoalProgress variant="radar" size="compact" className="fb-dock__goal" />
        <span className="fb-dock__cta">
          ENTRAR <span aria-hidden="true">→</span>
        </span>
      </button>
    </aside>
  );
}
