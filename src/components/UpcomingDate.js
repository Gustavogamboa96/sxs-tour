import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import addContact from '../api/brevo-create-contact';
import React, { useEffect, useState } from 'react';
import './Signup.css'



export default function UpcomingDate(props) {
  const { handleCloseUpcomingDate, handleOpenUpcomingDate, openUpcomingDate, openSignup } = props;
  const [modalFaded, setModalFaded] = useState(false);

  // Control modal fade effect
  useEffect(() => {
    if (openUpcomingDate) {
      setTimeout(() => {
        setModalFaded(true);
      }, 100);
    } else {
      setModalFaded(false);
    }
  }, [openUpcomingDate]);

  // Custom close handler with fade
  const handleModalClose = () => {
    setModalFaded(false);
    setTimeout(() => {
      handleCloseUpcomingDate();
    }, 300);
  };

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
    backgroundColor: '#B71C1C', // Your primary color
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

  const CloseButton = styled(IconButton)({
    position: 'absolute',
    right: '10px',
    top: '10px',
    color: '#B71C1C',
    zIndex: 10,
  });

  const style = {
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    color: '#B71C1C',
    backgroundColor: '#212121',
    outline: 'none',
    fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
    width: 425,
    maxWidth: '90vw',
    position: 'relative',
  };
  // Component mounts ready to be shown by parent

  return (
    <div>
      <Modal
        open={openUpcomingDate}
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
          <CloseButton onClick={handleModalClose} aria-label="close">
            <CloseIcon />
          </CloseButton>
          <Box>
            {/* <Typography id="modal-modal-title" variant="h6" component="h2"
              sx={{
                fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                width: '100%', // Adjust the width as needed
                margin: 'auto', // Center the TextField horizontally  
                paddingBottom: '3.5vh',
                textAlign: 'center'
              }}>
              ¡Fechas en España!
            </Typography> */}
            {/* <CoverImage>

            <img
              alt="¡Al coro de las masas! - La Vida Bohème"
              src="/images/cover-alcorodelasmasas.webp"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
          
            </CoverImage> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src="https://i.imgur.com/d1Bc4fP.jpeg"
                alt="Event Poster"
                style={{ width: '60%', height: 'auto' }}
              />
            </div>
            {/* <img src="https://wzeweb-p-visuelorga-evn-affiche.s3.eu-west-1.amazonaws.com/affiche_1294214.png" alt="Event Poster" style={{ width: '50%',  height: 'auto'}} /> */}
            <div style={{
              marginTop: '3vh',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '15px',
              width: '100%'
            }}>
              <Button variant="contained" color="primary"
                component="a"
                href='https://www.eventim-light.com/es/a/68235206e8423f40cbf39bca/e/682355e9e8423f40cbf39bcf'
                target="_blank"
                sx={{
                  fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                  backgroundColor: '#B71C1C',
                  color: 'black',
                  height: '55px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  lineHeight: '1.1',
                  '&:hover': {
                    backgroundColor: 'black',
                    color: '#B71C1C',
                  },
                }}>
                <div>Madrid</div>
                <div>26.11.25</div>
              </Button>

              <Button variant="contained" color="primary"
                component="a"
                href='https://dice.fm/event/53n3w8-la-vida-boheme-28th-nov-la-2-de-apolo-barcelona-tickets?pid=530cb286&_branch_match_id=1060721144327835601&utm_medium=partners_api&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXz8nMy9ZLyUxO1UvL1a9MsTQxT0lONTVItbQvyEyxNTU2SE4ysjBTqytKTUstKsrMS49PKsovL04tsnXOKMrPTQUAw7GvMEgAAAA%3D'
                target="_blank"
                sx={{
                  fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                  backgroundColor: '#B71C1C',
                  color: 'black',
                  height: '55px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  lineHeight: '1.1',
                  '&:hover': {
                    backgroundColor: 'black',
                    color: '#B71C1C',
                  },
                }}>
                <div>Barcelona</div>
                <div>28.11.25</div>
              </Button>

              <Button variant="contained" color="primary"
                component="a"
                href='https://dice.fm/event/xek7ma-ghost-sound-yerba-de-la-buena-present-la-vida-boheme-18th-dec-the-sultan-room-new-york-tickets' // Add the actual NYC ticket link here
                target="_blank"
                sx={{
                  fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                  backgroundColor: '#B71C1C',
                  color: 'black',
                  height: '55px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  lineHeight: '1.1',
                  '&:hover': {
                    backgroundColor: 'black',
                    color: '#B71C1C',
                  },
                }}>
                <div>NYC</div>
                <div>18.12.25</div>
              </Button>

              <Button variant="contained" color="primary"
                component="a"
                href='https://shotgun.live/es/events/zeyzey-presents-la-vida-boheme'
                target="_blank"
                sx={{
                  fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                  backgroundColor: '#B71C1C',
                  color: 'black',
                  height: '55px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  lineHeight: '1.1',
                  '&:hover': {
                    backgroundColor: 'black',
                    color: '#B71C1C',
                  },
                }}>
                <div>Miami</div>
                <div>20.12.25</div>
              </Button>

              <Button variant="contained" color="primary"
                component="a"
                href='https://ticketplate.com/checkout/la-vida-boheme-202512222100'
                target="_blank"
                sx={{
                  gridColumn: 'span 2',
                  justifySelf: 'center',
                  width: 'calc(50% - 7.5px)',
                  fontFamily: 'IBM Plex Sans, sans-serif, -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
                  backgroundColor: '#B71C1C',
                  color: 'black',
                  height: '55px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  lineHeight: '1.1',
                  '&:hover': {
                    backgroundColor: 'black',
                    color: '#B71C1C',
                  },
                }}>
                <div>Caracas</div>
                <div>22.12.25</div>
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
