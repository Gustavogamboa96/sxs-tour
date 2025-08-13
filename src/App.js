import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EntertainmentPage from './components/EntertainmentPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/entretenimiento" element={<EntertainmentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
