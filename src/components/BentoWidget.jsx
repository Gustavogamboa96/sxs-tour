import React from "react";
import "./BentoWidget.css";

export default function BentoWidget() {
  return (
    <a
      href="https://gustra.codes"
      target="_blank"
      rel="noopener noreferrer"
      className="bento-widget"
      aria-label="Bento Profile"
    >
      <img src="/images/crab.png" alt="" className="crab-icon" />
    </a>
  );
}
