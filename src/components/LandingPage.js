import React, {useState} from 'react'
import { links, events } from '../dates'
import './LandingPage.css'
import Signup from './Signup'
import { Snackbar } from '@mui/material'
import Alert from '@mui/material/Alert';
import MusicPlayer from './MusicPlayer'
import UpcomingDate from './UpcomingDate'



export default function LandingPage() {
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(true)
    const [openSignup, setOpenSignup] = useState(false);

    const [openUpcomingDate, setOpenUpcomingDate] = useState(false);
    const handleOpenUpcomingDate = () => setOpenUpcomingDate(true);
    const handleCloseUpcomingDate = () => {
        setOpenSignup(true);
        setOpenUpcomingDate(false);
    }

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
        <div className='animated-cursor'>
            <div className="bg-container d-flex align-items-center justify-content-start flex-column min-vh-100" style={{
                backgroundColor: '#000000',
                position: 'relative',
            }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0
                    }}
                >
                    <source src="/images/EntLoop1.webm" type="video/webm" />
                </video>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className='flex-grow-1' style={{ marginBottom: '65vh' }}>
                        <MusicPlayer />
                    </div>
                    <div className='footer d-flex justify-content-center'>
                        <ul className='list-unstyled d-flex flex-wrap justify-content-center' style={{ maxWidth: '1200px' }}>
                            {links.map((link, index) => (
                                <li key={index}
                                    className="col-12 col-sm-6 col-lg-3 text-center" >
                                    <a href={link.href} target="_blank" rel="noreferrer" onClick={link.onClick ? (e) => {
                                        e.preventDefault();
                                        reopenNewsletter();
                                    } : undefined} className="footer-link">
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <UpcomingDate
                openUpcomingDate={openUpcomingDate}
                handleOpenUpcomingDate={handleOpenUpcomingDate}
                handleCloseUpcomingDate={handleCloseUpcomingDate}
                openSignup={openSignup}
            />
            {openSignup && <Signup
                openSignup={openSignup}
                handleOpenSignup={handleOpenSignup}
                handleCloseSignup={handleCloseSignup}
                onSignupResponse={handleSignupResponse}
                openUpcomingDate={openUpcomingDate}
            />}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{ zIndex: 1300 }}
            >
                <Alert severity={isSuccess ? "success" : "error"} sx={{ backgroundColor: isSuccess ? 'lightgreen' : 'lightcoral', width: '60vw', display: 'flex', justifyContent: 'center' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
