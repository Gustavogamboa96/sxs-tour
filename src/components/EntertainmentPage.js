import React, { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';
import Signup from './Signup';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import './EntertainmentPage.css';

const EntertainmentPage = () => {
  const [openSignup, setOpenSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [fadeInPlayer, setFadeInPlayer] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Check if user has already signed up (from localStorage)
  useEffect(() => {
    const signedUp = localStorage.getItem('signed-up');
    if (signedUp === 'true') {
      setSignupSuccess(true);
      // Add a small delay before fading in the player
      setTimeout(() => {
        setFadeInPlayer(true);
      }, 500);
    } else {
      // If not signed up, open the signup modal automatically
      setTimeout(() => {
        setOpenSignup(true);
      }, 300);
    }
  }, []);

  // Apply fade-in effect whenever signupSuccess changes to true
  useEffect(() => {
    if (signupSuccess) {
      setTimeout(() => {
        setFadeInPlayer(true);
      }, 500);
    }
  }, [signupSuccess]);

  const handleOpenSignup = () => setOpenSignup(true);
  const handleCloseSignup = () => setOpenSignup(false);
  
  const handleSignupResponse = (message, success) => {
    setSnackbarMessage(message);
    setIsSuccess(success);
    setSnackbarOpen(true);
    
    if (success) {
      // Set transitioning state to prevent UI flicker
      setIsTransitioning(true);
      
      // The modal will fade out (handled by the Signup component)
      // Don't close the modal immediately, let it fade out first
      setTimeout(() => {
        handleCloseSignup();
        
        // Wait for modal to fully fade out, then show music player
        setTimeout(() => {
          setSignupSuccess(true);
          setIsTransitioning(false);
          // Fade-in is handled by the useEffect above
        }, 300);
      }, 500);
    }
  };

  return (
    <div className="entertainment-page">
      {signupSuccess || isTransitioning ? (
        <div className={`player-container ${fadeInPlayer ? 'fade-in' : ''}`}>
          <div className="music-player-wrapper">
            {signupSuccess && <MusicPlayer 
              filename="cono.wav" 
              title="¡COÑO!"
            />}
          </div>
        </div>
      ) : (
        <div className="signup-prompt">
          {/* <h2>¡Denuncia a tus vecinos para escuchar!</h2> */}
          <button 
            onClick={handleOpenSignup} 
            className="signup-button"
          >
            Denuncia
          </button>
        </div>
      )}
      
      <Signup 
        openSignup={openSignup}
        handleOpenSignup={handleOpenSignup}
        handleCloseSignup={handleCloseSignup}
        onSignupResponse={handleSignupResponse}
        openUpcomingDate={false}
        title="¡Denuncia a tus vecinos para escuchar!"
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
