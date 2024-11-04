import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import addContact from '../api/brevo-create-contact';
import React, { useEffect, useState } from 'react';
import './Signup.css'

export default function Signup(props) {
  const {onSignupResponse, handleCloseSignup, handleOpenSignup, openSignup} = props;
  // const [open, setOpen] = useState(false);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () =>{
  //   setOpen(false);
  //   setEmail('');
  // } ;


  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(true);
    } else {
      // Handle successful submission, e.g., send email or perform other actions
      console.log('Valid email:', email);
      try{
      const response = await addContact(email);
      console.log(response);
      if(response.id){
        onSignupResponse("¡Listo, ya estás suscrito!", true)
        localStorage.setItem('signed-up', 'true');
        setError(false);
        handleCloseSignup();
      }else if(response.code === 'duplicate_parameter'){
        onSignupResponse("Ese email ya esta suscrito", false)
        handleCloseSignup();
      }else{
        onSignupResponse("Hubo un problema al suscribirte", false)
        handleCloseSignup();
      }
      }catch(error){
        console.error(error);
      }
    }
  };


    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      // border:  '2px solid #000',
      boxShadow: 24,
      p: 4,
      color: '#3fea4b',
      backgroundColor: '#212121',
      outline: 'none',
      fontFamily:'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',

    };
    const signedUp = localStorage.getItem('signed-up');
    useEffect(()=>{
      if(!signedUp){
        const timer = setTimeout(() => {
          handleOpenSignup();
        }, 1500)
        return () => clearTimeout(timer);
      }
    }, [])

  return (
    <div>
      <Modal
        open={openSignup}
        onClose={handleCloseSignup}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2" 
          sx={{
              fontFamily:'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
              width: '100%', // Adjust the width as needed
              margin: 'auto', // Center the TextField horizontally  
              paddingBottom: '2vh'
          }}>
            Suscríbete a nuestro newsletter!
          </Typography>
          <TextField  
            id="outlined-basic" 
            label="Email" 
              variant="outlined"
              InputLabelProps={{
                style: { color: '#3fea4b' },
              }}
              sx={{
                '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline ': {
                  borderColor: '#3fea4b',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3fea4b', /* Replace 'green' with your desired color */
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
                width: '100%', // Adjust the width as needed
                margin: 'auto', // Center the TextField horizontally
                paddingBottom: '2vh'
                
              }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}  
            error={error}
            helperText={error ? 'Por favor usa un email válido!' : ''}
            
          />
          </Box>
        <Box>
            <Button onClick={handleSubmit} variant="contained" color="primary"
              sx={{
                fontFamily:'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                backgroundColor: '#3fea4b',
                color: 'black',
                width: '100%', // Adjust the width as needed
                margin: 'auto', // Center the TextField horizontally
                '&:hover': {
                  backgroundColor: 'black',
                  color: '#3fea4b',
                },
              }}>
              Suscribir
          </Button>
        </Box>
        </Box>
      </Modal>
    </div>
  )
}
