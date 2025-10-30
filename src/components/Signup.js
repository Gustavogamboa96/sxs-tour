import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import addContact from '../api/brevo-create-contact';
import React, { useEffect, useState } from 'react';
import './Signup.css'

export default function Signup(props) {
  const {onSignupResponse, handleCloseSignup, handleOpenSignup, openSignup, openUpcomingDate, title = "REGÍSTRESE CIUDADANO"} = props;
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [modalFaded, setModalFaded] = useState(false);

  // Control modal fade effect
  useEffect(() => {
    if (openSignup) {
      setTimeout(() => {
        setModalFaded(true);
      }, 100);
    } else {
      setModalFaded(false);
    }
  }, [openSignup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(true);
    } else {
      // Handle successful submission, e.g., send email or perform other actions
      console.log('Valid email:', email);
      try {
        const response = await addContact(email);
        console.log(response);
        
        if(response.id) {
          // Fade out the modal first
          setModalFaded(false);
          
          setTimeout(() => {
            onSignupResponse("¡Listo, ya estás suscrito!", true);
            localStorage.setItem('signed-up', 'true');
            setError(false);
            handleCloseSignup();
            setEmail('');
          }, 300);
        } else if(response.code === 'duplicate_parameter') {
          onSignupResponse("Ese email ya esta suscrito", false);
          handleCloseSignup();
        } else {
          onSignupResponse("Hubo un problema al suscribirte", false);
          handleCloseSignup();
        }
      } catch(error) {
        console.error(error);
      }
    }
  };

  // Custom close handler with fade
  const handleModalClose = () => {
    setModalFaded(false);
    setTimeout(() => {
      handleCloseSignup();
    }, 300);
  };

  const style = {
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    color: '#ff0000',
    backgroundColor: '#212121',
    outline: 'none',
    fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    width: '400px',
    maxWidth: '90vw',
  };
  
  const signedUp = localStorage.getItem('signed-up');

  useEffect(() => {
    if(!signedUp && openUpcomingDate) {
      const timer = setTimeout(() => {
        handleOpenSignup();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>
      <Modal
        open={openSignup}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        BackdropProps={{
          className: "modal-backdrop"
        }}
      >
        <Box sx={style} className={`modal-content ${modalFaded ? 'modal-fade-in' : ''}`}>
          <Box>
            <Typography 
              id="modal-modal-title" 
              variant="h6" 
              component="h2" 
              sx={{
                fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                width: '100%',
                margin: 'auto',
                paddingBottom: '2vh',
                textAlign: 'center'
              }}
            >
              {title}
            </Typography>
            <TextField  
              id="outlined-basic" 
              label="Email" 
              variant="outlined"
              InputLabelProps={{
                style: { color: '#B71C1C' },
              }}
              sx={{
                '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline ': {
                  borderColor: '#B71C1C',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#B71C1C',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
                width: '100%',
                margin: 'auto',
                paddingBottom: '2vh'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}  
              error={error}
              helperText={error ? 'Por favor usa un email válido!' : ''}
            />
          </Box>
          <Box>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              sx={{
                fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                backgroundColor: '#B71C1C',
                color: 'black',
                width: '100%',
                margin: 'auto',
                '&:hover': {
                  backgroundColor: 'black',
                  color: '#B71C1C',
                },
              }}
            >
              REGISTRARSE
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
