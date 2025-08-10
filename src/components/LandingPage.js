import React, { useState, useEffect } from 'react'
import { links, events } from '../dates'
import './LandingPage.css'
import Signup from './Signup'
import { Snackbar } from '@mui/material'
import Alert from '@mui/material/Alert';
import MusicPlayer from './MusicPlayer'
import UpcomingDate from './UpcomingDate'
import Presave from './Presave'
import BentoWidget from './BentoWidget'



export default function LandingPage() {
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(true)
    const [openSignup, setOpenSignup] = useState(false);
    const [openPresave, setOpenPresave] = useState(false);
    const [openUpcomingDate, setOpenUpcomingDate] = useState(false);

    const handleOpenPresave = () => setOpenPresave(true);
    const handleClosePresave = () => {
        setOpenUpcomingDate(true);
        setOpenPresave(false);
    }

    const handleOpenUpcomingDate = () => setOpenUpcomingDate(true);
    const handleCloseUpcomingDate = () => {
        setOpenSignup(true);
        setOpenUpcomingDate(false);
    }

    // Auto-show presave modal on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            handleOpenPresave();
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

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
                    className="background-video"
                >
                    <source src="/images/MuchachosAfueraTeaser1.webm" type="video/webm" />
                </video>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className='flex-grow-1 music-player-margin-bottom'>
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
            <Presave 
                openPresave={openPresave}
                handleOpenPresave={handleOpenPresave}
                handleClosePresave={handleClosePresave}
                openSignup={openSignup}
            />
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
            <BentoWidget />
        </div>
    )
}
