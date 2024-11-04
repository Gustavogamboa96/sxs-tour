import React, {useState} from 'react'
import { links, events } from '../dates'
import './LandingPage.css'
import Signup from './Signup'
import { Snackbar } from '@mui/material'
import Alert from '@mui/material/Alert';



export default function LandingPage() {
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(true)
    const [openSignup, setOpenSignup] = useState(false);

    const handleSignupResponse = (message, success) => {
        setSnackbarMessage(message)
        setIsSuccess(success)
        setSnackbarOpen(true)
      }
    
    const handleCloseSignup = () => setOpenSignup(false);
    const handleOpenSignup = () => setOpenSignup(true);


    return (
        <div className='row allofit animated-cursor'>
            <div className="col-auto g-xl-0 pr-lg-0 pr-md-0 pr-sm-10" >
                <img src="/images/backgroud-mobile-compress.webp" alt="tour-banner" className="img-fluid" style={{ maxHeight: '100vh' }} />
            </div>
            <div className="col d-flex align-items-center justify-content-start" style={{ backgroundImage: "url('/images/backgroud-ruido-compress.webp')", paddingLeft: '5vw' }}>
                <div>
                    <div className='dates-div pb-l-3'>
                        {events.map((event, index) => (
                            <a key={index} href={event.link} target="_blank" rel="noopener noreferrer">
                                <div className="event">
                                    <p>{event.date}... ... ... ...{event.city}... ... ...{event.venue}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                    <div className='row footer align-items-flex-end justify-content-center '>
                        <ul className='list-unstyled d-flex' style={{paddingLeft: '7.5%'}}>
                            {links.map((link, index) => (
                                <li key={index} >
                                    <a href={link.href} className="footer-link">
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Signup
                openSignup={openSignup}
                handleOpenSignup={handleOpenSignup}
                handleCloseSignup={handleCloseSignup}
                onSignupResponse={handleSignupResponse}
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{ zIndex: 1300 }}
            >
                <Alert severity={isSuccess ?"success" : "error"} sx={{ backgroundColor: isSuccess ? 'lightgreen' : 'lightcoral', width: '60vw', display: 'flex', justifyContent: 'center' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
