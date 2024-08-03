import React, { useEffect, useState } from 'react';
import './VerticalScrollProgressBar.css';

const VerticalScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(1);

 
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
      console.log("hello");
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
