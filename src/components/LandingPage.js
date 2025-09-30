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
import TerminalPlayer from './TerminalPlayer'



export default function LandingPage() {
    // Configuration flags - set these to true/false to enable/disable specific modals
    const ENABLE_PRESAVE = false;     // Set to false to skip the Presave modal
    const ENABLE_UPCOMING = true;    // Set to false to skip the UpcomingDate modal
    const ENABLE_SIGNUP = true;      // Set to false to skip the Signup modal
    const ENABLE_TERMINAL = false;   // Set to false to skip the Terminal (already false)
    
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(true)
    const [openSignup, setOpenSignup] = useState(false);
    const [openPresave, setOpenPresave] = useState(false);
    const [openUpcomingDate, setOpenUpcomingDate] = useState(false);
    const [openTerminal, setOpenTerminal] = useState(false);

    const handleOpenPresave = () => setOpenPresave(true);
    const handleClosePresave = () => {
        setOpenPresave(false);
        // Start next modal in sequence based on enabled flags
        setTimeout(() => {
            if (ENABLE_UPCOMING) {
                setOpenUpcomingDate(true);
            } else if (ENABLE_SIGNUP) {
                setOpenSignup(true);
            }
        }, 300);
    }

    const handleOpenUpcomingDate = () => setOpenUpcomingDate(true);
    const handleCloseUpcomingDate = () => {
        setOpenUpcomingDate(false);
        // Start next modal in sequence based on enabled flags
        setTimeout(() => {
            if (ENABLE_SIGNUP) {
                setOpenSignup(true);
            }
        }, 300);
    }

    // Auto-show modal sequence on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            // Determine which modal to show first based on enabled flags
            if (ENABLE_PRESAVE) {
                handleOpenPresave();
            } else if (ENABLE_UPCOMING) {
                handleOpenUpcomingDate();
            } else if (ENABLE_SIGNUP) {
                handleOpenSignup();
            }
            // If all are disabled, no modals will show
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Add keyboard shortcut for terminal
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Alt+T keyboard shortcut to open terminal
            if (event.altKey && event.key === 't') {
                setOpenTerminal(prev => !prev);
            }
            // Escape key to close terminal
            if (event.key === 'Escape' && openTerminal) {
                setOpenTerminal(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [openTerminal]);

    const handleSignupResponse = (message, success) => {
        setSnackbarMessage(message)
        setIsSuccess(success)
        setSnackbarOpen(true)
        
        // Modal closing and terminal opening are handled in handleCloseSignup
        setTimeout(() => {
            handleCloseSignup();
        }, 500);
    }

    const handleCloseSignup = () => {
        setOpenSignup(false);
        
        // Show terminal based on enabled flag
        if (ENABLE_TERMINAL) {
            setTimeout(() => {
                setOpenTerminal(true);
            }, 1000);
        }
    };
    
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
                    <source src="/images/TDNBackgroundWeb.webm" type="video/webm" />
                </video>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className='flex-grow-1 music-player-margin-bottom'>
                        <MusicPlayer
                            title={"Pobres Románticos"}
                            filename={"05.wav"}
                        />
                    </div>
                    <div className='footer d-flex justify-content-center'>
                        <ul className='list-unstyled d-flex flex-wrap justify-content-center' style={{ maxWidth: '1200px' }}>
                            {links.map((link, index) => (
                                <li key={index}
                                    className="col-12 col-sm-6 col-lg-3 text-center" >
                                    <a href={link.href} target="_blank" rel="noreferrer" onClick={
                                        link.onClick ? (e) => {
                                            e.preventDefault();
                                            reopenNewsletter();
                                        } : link.isTerminal ? (e) => {
                                            e.preventDefault();
                                            setOpenTerminal(true);
                                        } : undefined
                                    } className="footer-link">
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {/* PRESAVE MODAL - Control with ENABLE_PRESAVE flag at top of component */}
            {ENABLE_PRESAVE && (
                <Presave 
                    openPresave={openPresave}
                    handleOpenPresave={handleOpenPresave}
                    handleClosePresave={handleClosePresave}
                    openSignup={openSignup}
                />
            )}
            {/* END PRESAVE MODAL */}
            {/* UPCOMING DATE MODAL - Control with ENABLE_UPCOMING flag at top of component */}
            {ENABLE_UPCOMING && (
                <UpcomingDate
                    openUpcomingDate={openUpcomingDate}
                    handleOpenUpcomingDate={handleOpenUpcomingDate}
                    handleCloseUpcomingDate={handleCloseUpcomingDate}
                    openSignup={openSignup}
                />
            )}
            {/* END UPCOMING DATE MODAL */}
            {/* SIGNUP MODAL - Control with ENABLE_SIGNUP flag at top of component */}
            {ENABLE_SIGNUP && openSignup && (
                <Signup
                    openSignup={openSignup}
                    handleOpenSignup={handleOpenSignup}
                    handleCloseSignup={handleCloseSignup}
                    onSignupResponse={handleSignupResponse}
                    openUpcomingDate={openUpcomingDate}
                />
            )}
            {/* END SIGNUP MODAL */}
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
            
            {/* TERMINAL PLAYER - Control with ENABLE_TERMINAL flag at top of component */}
            {ENABLE_TERMINAL && (
                <TerminalPlayer 
                    open={openTerminal} 
                    onClose={() => setOpenTerminal(false)} 
                />
            )}
            {/* END TERMINAL PLAYER */}
        </div>
    )
}
