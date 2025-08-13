import React from 'react';
import MusicPlayer from './MusicPlayer';
import './EntertainmentPage.css';

const EntertainmentPage = () => {
  return (
    <div className="entertainment-page">
      <div className="player-container">
        <MusicPlayer filename="FINAL_Entretenimiento!_ver2eqd2444_1.wav" />
      </div>
    </div>
  );
};

export default EntertainmentPage;
