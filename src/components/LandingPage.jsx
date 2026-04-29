import React, { useState, useEffect, useRef } from 'react'
import { links } from '../dates'
import './LandingPage.css'
import Signup from './Signup'
import { Snackbar } from '@mui/material'
import Alert from '@mui/material/Alert'
import MusicPlayer from './MusicPlayer'
import UpcomingDate from './UpcomingDate'
import Presave from './Presave'
import ChatBot from './ChatBot'
import RadarMap from './RadarMap'

export default function LandingPage() {
    const ENABLE_PRESAVE = false;
    const ENABLE_UPCOMING = false;
    const ENABLE_SIGNUP = true;
    const ENABLE_CHATBOT = true;

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(true)
    const [openSignup, setOpenSignup] = useState(false)
    const [openPresave, setOpenPresave] = useState(false)
    const [openUpcomingDate, setOpenUpcomingDate] = useState(false)
    const [openChatBot, setOpenChatBot] = useState(false)
    const [isOnboardingSequence, setIsOnboardingSequence] = useState(false)
    const [highlightedCityKey, setHighlightedCityKey] = useState(null)
    const [showAllDates, setShowAllDates] = useState(false)
    const handleHighlightCity = (key) => {
        setHighlightedCityKey(key)
        if (key !== null) setShowAllDates(false)
    }
    const handleDismissAll = () => {
        setShowAllDates(false)
        setHighlightedCityKey(null)
    }

    // Tour data (fetched & geocoded here, passed to RadarMap)
    const [tourDates, setTourDates] = useState([])
    const [tourLoading, setTourLoading] = useState(true)
    const geoCache = useRef({})

    useEffect(() => {
        const tourApiUrl = import.meta.env.VITE_TOUR_API_URL
        const geocodingApiKey = import.meta.env.VITE_OPENCAGE_KEY
        if (!tourApiUrl) { setTourLoading(false); return; }
        let cancelled = false

        async function fetchAndGeocode() {
            try {
                const res = await fetch(tourApiUrl)
                const data = await res.json()
                const raw = data.tourDates || []
                const parsed = raw.map((r, i) => {
                    const parts = r.lugar.split(',').map(s => s.trim())
                    const city = parts[0] || ''
                    const country = parts.slice(1).join(', ') || ''
                    const cityKey = r.lugar.trim()
                    let isoDate = r.fecha
                    const dp = r.fecha.split('.')
                    if (dp.length === 3) isoDate = `${dp[2]}-${dp[1]}-${dp[0]}`
                    return { id: String(i), city, country, date: isoDate, rawDate: r.fecha, ticketUrl: r.ticketLink, cityKey, lat: null, lng: null }
                }).filter(r => r.city)

                const uniqueCities = [...new Set(parsed.map(r => r.cityKey))]
                if (geocodingApiKey) {
                    await Promise.all(uniqueCities.map(async cityKey => {
                        if (geoCache.current[cityKey]) return
                        try {
                            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityKey)}&key=${encodeURIComponent(geocodingApiKey)}&limit=1`
                            const geoRes = await fetch(url)
                            const geoData = await geoRes.json()
                            if (geoData.results?.length > 0) {
                                const { lat, lng } = geoData.results[0].geometry
                                geoCache.current[cityKey] = { lat, lng }
                            }
                        } catch { /* skip */ }
                    }))
                }
                if (cancelled) return
                const final = parsed.map(r => {
                    const coords = geoCache.current[r.cityKey]
                    return coords ? { ...r, lat: coords.lat, lng: coords.lng } : r
                })
                setTourDates(final)
            } catch { /* silently fail */ }
            if (!cancelled) setTourLoading(false)
        }

        fetchAndGeocode()
        return () => { cancelled = true }
    }, [])

    const handleOpenPresave = () => setOpenPresave(true)
    const handleClosePresave = () => {
        setOpenPresave(false)
        setTimeout(() => {
            if (ENABLE_UPCOMING) setOpenUpcomingDate(true)
            else if (ENABLE_SIGNUP) setOpenSignup(true)
        }, 300)
    }

    const handleOpenUpcomingDate = () => setOpenUpcomingDate(true)
    const handleCloseUpcomingDate = () => {
        setOpenUpcomingDate(false)
        if (isOnboardingSequence) {
            setTimeout(() => {
                if (ENABLE_SIGNUP) setOpenSignup(true)
                setIsOnboardingSequence(false)
            }, 300)
        }
    }

    const handleOpenSignup = () => setOpenSignup(true)
    const handleCloseSignup = () => setOpenSignup(false)

    const handleSignupResponse = (message, success) => {
        setSnackbarMessage(message)
        setIsSuccess(success)
        setSnackbarOpen(true)
        setTimeout(() => handleCloseSignup(), 500)
    }

    const handleCloseChatBot = () => setOpenChatBot(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOnboardingSequence(true)
            if (ENABLE_PRESAVE) handleOpenPresave()
            else if (ENABLE_UPCOMING) handleOpenUpcomingDate()
            else if (ENABLE_SIGNUP) handleOpenSignup()
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!ENABLE_CHATBOT) return
        const secret = 'chatbot'
        let buffer = ''
        const handleKeyPress = (e) => {
            const tag = e.target.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
            buffer += e.key.toLowerCase()
            if (buffer.length > secret.length) buffer = buffer.slice(-secret.length)
            if (buffer === secret) { buffer = ''; setOpenChatBot(true) }
        }
        window.addEventListener('keypress', handleKeyPress)
        return () => window.removeEventListener('keypress', handleKeyPress)
    }, [])

    return (
        <div className="landing-root">
            {/* Full-screen map fills the entire viewport */}
            <div className="landing-map">
                <RadarMap
                    locations={tourDates}
                    highlightedCityKey={highlightedCityKey}
                    setHighlightedCityKey={handleHighlightCity}
                    loading={tourLoading}
                    showAllDates={showAllDates}
                    onDismissAll={handleDismissAll}
                />
            </div>

            {/* Compact music player — top-left overlay */}
            <div className="landing-player-overlay">
                <MusicPlayer
                    title="Pobres Románticos"
                    filename="05.wav"
                    compact
                />
            </div>

            {/* Footer links — bottom overlay */}
            <div className="landing-footer-overlay">
                <ul className="landing-footer-links">
                    {links.map((link, index) => (
                        <li key={index}>
                            <a
                                href={link.href}
                                target={link.href === '#' ? undefined : "_blank"}
                                rel="noreferrer"
                                onClick={link.onClick ? (e) => { e.preventDefault(); handleOpenSignup() } :
                                    link.isUpcoming ? (e) => { e.preventDefault(); setShowAllDates(prev => !prev); setHighlightedCityKey(null); } : undefined}
                                className="footer-link"
                            >
                                {link.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {ENABLE_PRESAVE && (
                <Presave
                    openPresave={openPresave}
                    handleOpenPresave={handleOpenPresave}
                    handleClosePresave={handleClosePresave}
                    openSignup={openSignup}
                />
            )}
            {ENABLE_UPCOMING && (
                <UpcomingDate
                    openUpcomingDate={openUpcomingDate}
                    handleOpenUpcomingDate={handleOpenUpcomingDate}
                    handleCloseUpcomingDate={handleCloseUpcomingDate}
                    openSignup={openSignup}
                />
            )}
            {ENABLE_SIGNUP && openSignup && (
                <Signup
                    openSignup={openSignup}
                    handleOpenSignup={handleOpenSignup}
                    handleCloseSignup={handleCloseSignup}
                    onSignupResponse={handleSignupResponse}
                    openUpcomingDate={openUpcomingDate}
                />
            )}
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
            {ENABLE_CHATBOT && (
                <ChatBot open={openChatBot} onClose={handleCloseChatBot} />
            )}
        </div>
    )
}
