import React, { useEffect, useState } from 'react';
import './VerticalScrollProgressBar.css';

const VerticalScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ height: `${scrollProgress}%` }}
      ></div>
    </div>
  );
};

export default VerticalScrollProgressBar;
