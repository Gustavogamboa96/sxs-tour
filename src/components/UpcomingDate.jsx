import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { useTourDates } from '../hooks/useTourDates';
import './Signup.css'



export default function UpcomingDate(props) {
  const { handleCloseUpcomingDate, openUpcomingDate } = props;
  const [modalFaded, setModalFaded] = useState(false);
  const { tourDates, banner, loading, error } = useTourDates();

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
            {/* Banner Image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={banner || "/images/LVB-Tour3.webp"}
                alt="Event Poster"
                style={{ width: '60%', height: 'auto' }}
              />
            </div>

            {/* Tour Dates */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3vh' }}>
                <CircularProgress sx={{ color: '#B71C1C' }} />
              </div>
            )}
            
            {!loading && error && (
              <Typography sx={{ color: '#B71C1C', textAlign: 'center', marginTop: '3vh' }}>
                Error loading dates
              </Typography>
            )}
            
            {!loading && !error && tourDates.length > 0 && (
              <div style={{
                marginTop: '3vh',
                display: 'grid',
                gridTemplateColumns: tourDates.length === 1 ? '1fr' : '1fr 1fr',
                gap: '15px',
                width: '100%'
              }}>
                {tourDates.map((date) => {
                  // For odd number of dates, make the last one span full width and center it
                  const dateIndex = tourDates.indexOf(date);
                  const isLastOdd = tourDates.length % 2 === 1 && dateIndex === tourDates.length - 1;
                  return (
                    <Button
                      key={`${date.fecha}-${date.lugar}`}
                      variant="contained"
                      color="primary"
                      component="a"
                      href={date.ticketLink}
                      target="_blank"
                      sx={{
                        ...(isLastOdd && {
                          gridColumn: 'span 2',
                          justifySelf: 'center',
                          width: 'calc(50% - 7.5px)',
                        }),
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
                      }}
                    >
                      <div>{date.lugar}</div>
                      <div>{date.fecha}</div>
                    </Button>
                  );
                })}
              </div>
            )}
            
            {!loading && !error && tourDates.length === 0 && (
              <Typography sx={{ color: '#B71C1C', textAlign: 'center', marginTop: '3vh' }}>
                No upcoming dates
              </Typography>
            )}

            {/* Commented out date buttons
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
                href='https://dice.fm/event/xek7ma-ghost-sound-yerba-de-la-buena-present-la-vida-boheme-18th-dec-the-sultan-room-new-york-tickets'
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
            */}
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
