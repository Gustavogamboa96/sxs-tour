import React, { useEffect, useState } from 'react';
import { formatUSD } from '../../config/fallaBoconoConfig';
import useFundraisingProgress from './useFundraisingProgress';
import './GoalProgress.css';

/**
 * Barra de meta compartida.
 * variant: 'radar' (home, mono + amarillo) | 'stone' (página editorial)
 * size: 'compact' | 'full'
 */
export default function GoalProgress({ variant = 'stone', size = 'compact', className = '' }) {
  const { raisedUSD, goalUSD, percent, ratio, lastUpdated, remainingUSD } = useFundraisingProgress();
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFill(ratio));
    return () => cancelAnimationFrame(id);
  }, [ratio]);

  const ticks = size === 'full' ? [0.25, 0.5, 0.75] : [];

  return (
    <div
      className={`goal goal--${variant} goal--${size} ${className}`}
      role="group"
      aria-label={`Meta de recaudación: ${formatUSD(raisedUSD)} de ${formatUSD(goalUSD)} (${percent}%)`}
    >
      {size === 'full' ? (
        <div className="goal__figures">
          <div className="goal__figure">
            <span className="goal__label">Recaudación neta acumulada</span>
            <span className="goal__value goal__value--big">{formatUSD(raisedUSD)}</span>
          </div>
          <div className="goal__figure goal__figure--right">
            <span className="goal__label">Meta</span>
            <span className="goal__value">{formatUSD(goalUSD)}</span>
          </div>
        </div>
      ) : (
        <div className="goal__row">
          <span className="goal__value">
            {formatUSD(raisedUSD)} <span className="goal__of">/ {formatUSD(goalUSD)}</span>
          </span>
          <span className="goal__pct">{percent}%</span>
        </div>
      )}

      <div
        className="goal__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={goalUSD}
        aria-valuenow={raisedUSD}
      >
        <div className="goal__fill" style={{ transform: `scaleX(${fill})` }} />
        {ratio < 1 && <span className="goal__cursor" style={{ left: `${fill * 100}%` }} />}
        {ticks.map(t => (
          <span key={t} className="goal__tick" style={{ left: `${t * 100}%` }} />
        ))}
      </div>

      {size === 'full' && (
        <div className="goal__meta">
          <span><strong>{percent}%</strong> de la meta</span>
          <span>Faltan {formatUSD(remainingUSD)}</span>
          {lastUpdated && <span>Última actualización · {lastUpdated}</span>}
        </div>
      )}
    </div>
  );
}
