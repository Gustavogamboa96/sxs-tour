import React, {useState} from 'react'
import { links, events } from '../dates'
import './LandingPage.css'
import Signup from './Signup'
import { Snackbar } from '@mui/material'
import Alert from '@mui/material/Alert';
import MusicPlayer from './MusicPlayer'
import Presave from './Presave'



export default function LandingPage() {
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(true)
    const [openSignup, setOpenSignup] = useState(false);

    const [openPresave, setOpenPresave] = useState(false);
    const handleOpenPresave = () => setOpenPresave(true);
    const handleClosePresave = () => setOpenPresave(false);

    const handleSignupResponse = (message, success) => {
        setSnackbarMessage(message)
        setIsSuccess(success)
        setSnackbarOpen(true)
      }
    
    const handleCloseSignup = () => setOpenSignup(false);
    const handleOpenSignup = () => setOpenSignup(true);

    const reopenNewsletter = () => {
        handleOpenSignup();
    }


    return (
        <div className='row allofit animated-cursor'>
            {/* <div className="col-auto g-xl-0 pr-lg-0 pr-md-0 pr-sm-10" >
                <img src="/images/backgroud-mobile-compress.webp" alt="tour-banner" className="img-fluid" style={{ maxHeight: '100vh' }} />
            </div> */}
            <div className="bg-container col d-flex align-items-center justify-content-start flex-column min-vh-100" style={{ backgroundImage: "url('/images/cover-elcorodelasmasas.webp')", paddingLeft: '5vw' }}>
                <div>
                    <div className='flex-grow-1' style={{marginBottom: '69vh'}}>
                        <MusicPlayer/>
                    </div>
                    {/* <div className='dates-div pb-l-3'>
                        {events.map((event, index) => (
                            <a key={index} href={event.link} target="_blank" rel="noopener noreferrer">
                                <div className="event">
                                    <p>{event.date}... ... ... ...{event.city}... ... ...{event.venue}</p>
                                </div>
                            </a>
                        ))}
                    </div> */}
                    <div className='row footer align-items-flex-end justify-content-center'>
                        <ul className='list-unstyled row justify-content-center'>
                            {links.map((link, index) => (
                                <li key={index}
                                className="col-12 col-sm-6 col-lg-3 mb-3" >
                                    <a href={link.href} target="_blank" rel="noreferrer" onClick={link.onClick ? (e) => {
                                        e.preventDefault(); // Prevent navigation for links with onClick
                                        reopenNewsletter();
                                    } : undefined} className="footer-link d-block text-md-left text-xs-center">
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
            {!openSignup && <Presave
            openPresave={openPresave}
            handleOpenPresave={handleOpenPresave}
            handleClosePresave={handleClosePresave}
            openSignup={openSignup}
            />}
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
