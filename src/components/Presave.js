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
  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#B71C1C', // Your primary color
    color: '#212121', // Text color
    '&:hover': {
      color: '#1a1c1a',
      backgroundColor: '#B71C1C', // Adjust hover color if needed
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
      width: 425,
      bgcolor: 'background.paper',
      // border:  '2px solid #000',
      boxShadow: 24,
      p: 4,
      color: '#B71C1C',
      backgroundColor: '#212121',
      outline: 'none',
      fontFamily:'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',

    };
// Component mounts ready to be shown by parent

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
            {/* <Typography id="modal-modal-title" variant="h6" component="h2"
              sx={{
                fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                width: '100%', // Adjust the width as needed
                margin: 'auto', // Center the TextField horizontally  
                paddingBottom: '3.5vh',
                textAlign: 'center'
              }}>
              ¡Dale presave a nuestro nuevo single!
            </Typography> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                    src="https://cloudinary-cdn.ffm.to/s--SAeKXt6I--/f_webp/https%3A%2F%2Fimagestore.ffm.to%2Flink%2Ff3ed95ffaa8758de570a3b2d8148d215.jpeg"
                    alt="¡COÑO! - La Vida Bohème"
                    style={{ width: '60%', height: 'auto' }}
                />
            </div>
            <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary"
            component="a"
            href="https://ditto.fm/cono-la-vida-boheme"
            target="_blank"
              sx={{
                fontFamily:'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                backgroundColor: '#B71C1C',
                color: 'black',
                width: '100%',
                margin: 'auto',
                '&:hover': {
                  backgroundColor: 'black',
                  color: '#B71C1C',
                },
              }}>
              Pre-save ¡COÑO!
            </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
