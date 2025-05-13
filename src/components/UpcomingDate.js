import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import addContact from '../api/brevo-create-contact';
import React, { useEffect, useState } from 'react';
import './Signup.css'



export default function UpcomingDate(props) {
  const {handleCloseUpcomingDate, handleOpenUpcomingDate, openUpcomingDate, openSignup} = props;
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
      width: 425,
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
          handleOpenUpcomingDate();
        }, 1500)
        return () => clearTimeout(timer);
      }
    }, [])

  return (
    <div>
      <Modal
        open={openUpcomingDate}
        onClose={handleCloseUpcomingDate}
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
              ¡Fechas en España!
            </Typography>
            {/* <CoverImage>

            <img
              alt="¡Al coro de las masas! - La Vida Bohème"
              src="/images/cover-alcorodelasmasas.webp"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
          
            </CoverImage> */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src="https://dice-media.imgix.net/attachments/2025-05-06/079e8679-6343-4697-bb13-c8c1e17ef7a7.jpg?rect=1160%2C0%2C4640%2C4640&auto=format%2Ccompress&q=40&w=328&h=328&fit=crop&crop=faces%2Ccenter&dpr=2"
                        alt="Event Poster"
                        style={{ width: '50%', height: 'auto' }}
                    />
                </div>
            {/* <img src="https://wzeweb-p-visuelorga-evn-affiche.s3.eu-west-1.amazonaws.com/affiche_1294214.png" alt="Event Poster" style={{ width: '50%',  height: 'auto'}} /> */}
            <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
            {/* <StyledButton variant="contained" disableElevation
            component="a" // This makes the Button act like an anchor tag
            href="https://tinyurl.com/bdjc393u" // The link destination
            target="_blank" // Opens the link in a new tab (optional)
            rel="noopener noreferrer" 
            sx={{color: '#3fea4b',
              backgroundColor: '#212121',
              }}>
                Entradas
            </StyledButton> */}
            <Button variant="contained" color="primary"
            component="a" // This makes the Button act like an anchor tag
            href='https://www.eventim-light.com/es/a/68235206e8423f40cbf39bca/e/682355e9e8423f40cbf39bcf' // The link destination
            target="_blank" // Opens the link in a new tab (optional)
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
              Tickets Madrid 26.11.25
          </Button>
</div>
            <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary"
            component="a" // This makes the Button act like an anchor tag
            href='https://dice.fm/event/53n3w8-la-vida-boheme-28th-nov-la-2-de-apolo-barcelona-tickets?pid=530cb286&_branch_match_id=1060721144327835601&utm_medium=partners_api&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXz8nMy9ZLyUxO1UvL1a9MsTQxT0lONTVItbQvyEyxNTU2SE4ysjBTqytKTUstKsrMS49PKsovL04tsnXOKMrPTQUAw7GvMEgAAAA%3D' // The link destination
            target="_blank" // Opens the link in a new tab (optional)
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
              Tickets Barcelona 28.11.25
          </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
