import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EntertainmentPage from './components/EntertainmentPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/volver-a-sonar" element={<Navigate to={{ pathname: '/', hash: '#falla-bocono' }} replace />} />
        <Route path="/falla-bocono" element={<Navigate to={{ pathname: '/', hash: '#falla-bocono' }} replace />} />
        <Route path="/denuncia" element={<EntertainmentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
