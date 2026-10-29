import React from 'react';
import useFundraisingProgress from './useFundraisingProgress';
import './FallaPointer.css';

export default function FallaPointer({ x, y, containerWidth, onOpen }) {
  const { percent } = useFundraisingProgress();
  if (x == null || y == null) return null;
  const flip = containerWidth ? x > containerWidth - 210 : false;

  const open = (e) => {
    e.stopPropagation();
    const r = e.currentTarget.querySelector('.fb-pointer__core')?.getBoundingClientRect();
    onOpen?.(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null);
  };

  return (
    <button
      type="button"
      className={`fb-pointer${flip ? ' fb-pointer--flip' : ''}`}
      style={{ left: x, top: y }}
      onClick={open}
      aria-label="Abrir FALLA/BOCONÓ × Volver a Sonar"
    >
      <span className="fb-pointer__ping" aria-hidden="true" />
      <span className="fb-pointer__reticle" aria-hidden="true" />
      <span className="fb-pointer__core" aria-hidden="true" />
      <span className="fb-pointer__label" aria-hidden="true">
        <span className="fb-pointer__leader" />
        <span className="fb-pointer__text">
          <span className="fb-pointer__title">FALLA/BOCONÓ</span>
          <span className="fb-pointer__sub">VOLVER A SONAR · {percent}%</span>
        </span>
      </span>
    </button>
  );
}
