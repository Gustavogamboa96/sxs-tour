import React, { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';
import Signup from './Signup';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import './EntertainmentPage.css';

const EntertainmentPage = () => {
  const [openSignup, setOpenSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Check if user has already signed up (from localStorage)
  useEffect(() => {
    const signedUp = localStorage.getItem('signed-up');
    if (signedUp === 'true') {
      setSignupSuccess(true);
    } else {
      // If not signed up, open the signup modal automatically
      setTimeout(() => {
        setOpenSignup(true);
      }, 300);
    }
  }, []);

  const handleOpenSignup = () => setOpenSignup(true);
  const handleCloseSignup = () => setOpenSignup(false);
  
  const handleSignupResponse = (message, success) => {
    setSnackbarMessage(message);
    setIsSuccess(success);
    setSnackbarOpen(true);
    
    if (success) {
      handleCloseSignup();
      // Set a small delay before showing the music player
      setTimeout(() => {
        setSignupSuccess(true);
      }, 300);
    }
  };

  return (
    <div className="entertainment-page">
      {signupSuccess ? (
        <div className="player-container">
          <MusicPlayer filename="FINAL_Entretenimiento!_ver2eqd2444_1.wav" />
        </div>
      ) : (
        <div className="signup-prompt">
          <h2>¡Suscríbete para escuchar!</h2>
          <button 
            onClick={handleOpenSignup} 
            className="signup-button"
          >
            Suscribirme
          </button>
        </div>
      )}
      
      <Signup 
        openSignup={openSignup}
        handleOpenSignup={handleOpenSignup}
        handleCloseSignup={handleCloseSignup}
        onSignupResponse={handleSignupResponse}
        openUpcomingDate={false}
      />
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 1400 }}
      >
        <Alert 
          severity={isSuccess ? "success" : "error"} 
          sx={{ 
            backgroundColor: isSuccess ? 'lightgreen' : 'lightcoral', 
            width: '60vw', 
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EntertainmentPage;
