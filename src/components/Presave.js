import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import addContact from '../api/brevo-create-contact';
import React, { useEffect, useState } from 'react';
import './Signup.css'



export default function Presave(props) {
  const {handleClosePresave, handleOpenPresave, openPresave, openSignup} = props;
  // const [open, setOpen] = useState(false);
  // const [email, setEmail] = React.useState('');
  // const [error, setError] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () =>{
  //   setOpen(false);
  //   setEmail('');
  // } ;
  const CoverImage = styled('div')({
    width: 100,
    height: 100,
    objectFit: 'cover',
    overflow: 'hidden',
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
  });

  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#3fea4b', // Your primary color
    color: '#212121', // Text color
    '&:hover': {
      color: '#1a1c1a',
      backgroundColor: '#3fea4b', // Adjust hover color if needed
      opacity: 0.8, 
    },
    borderRadius: 5, // Adjust border radius as desired
    padding: '12px 24px', // Adjust padding as desired
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'uppercase',
    transition: 'all 0.2s ease-in-out', 
  }));

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '30vw',
      bgcolor: 'background.paper',
      // border:  '2px solid #000',
      boxShadow: 24,
      p: 4,
      color: '#3fea4b',
      backgroundColor: '#212121',
      outline: 'none',
      fontFamily:'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',

    };
useEffect(()=>{
      if(!openSignup){
        const timer = setTimeout(() => {
          handleOpenPresave();
        }, 1500)
        return () => clearTimeout(timer);
      }
    }, [])

  return (
    <div>
      <Modal
        open={openPresave}
        onClose={handleClosePresave}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <Typography id="modal-modal-title" variant="h6" component="h2"
              sx={{
                fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                width: '100%', // Adjust the width as needed
                margin: 'auto', // Center the TextField horizontally  
                paddingBottom: '3.5vh',
                textAlign: 'center'
              }}>
              ¡Dale presave a nuestro nuevo single!
            </Typography>
            {/* <CoverImage>

            <img
              alt="¡Al coro de las masas! - La Vida Bohème"
              src="/images/cover-alcorodelasmasas.webp"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
          
            </CoverImage> */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StyledButton variant="contained" disableElevation
            component="a" // This makes the Button act like an anchor tag
            href="https://ditto.fm/al-coro-de-las-masas/presavecallback?context=pre_save&service=spotify&redirecturl&actionid&order=678279aba25e1ee52ea5558c&fpEnabled=false&user=Gustavo%20Gamboa%20Malaver&status=success&origin=presavecallback" // The link destination
            target="_blank" // Opens the link in a new tab (optional)
            rel="noopener noreferrer" 
            sx={{color: '#3fea4b',
              backgroundColor: '#212121',
              }}>
                Pre-save
            </StyledButton>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
