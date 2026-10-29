import React, { useState, useEffect, useRef, useCallback } from 'react'
import { links, events } from '../dates'
import './LandingPage.css'
import Signup from './Signup'
import { Snackbar } from '@mui/material'
import Alert from '@mui/material/Alert'
import MusicPlayer from './MusicPlayer'
import UpcomingDate from './UpcomingDate'
import Presave from './Presave'
import ChatBot from './ChatBot'
import RadarMap from './RadarMap'
import BentoWidget from './BentoWidget'
import FallaBoconoExperience from './FallaBocono/FallaBoconoExperience'
import { setLiveRaisedUSD } from '../config/fallaBoconoConfig'
import CrumpleTransition from './FallaBocono/CrumpleTransition'
import FallaBoconoDock from './FallaBocono/FallaBoconoDock'

const FALLA_HASH = '#falla-bocono'
const FALLA_HASHES = [FALLA_HASH, '#volver-a-sonar']
const isFallaHash = () => FALLA_HASHES.includes(window.location.hash.toLowerCase())
const baseUrl = () => window.location.pathname + window.location.search
const pointerOrigin = () => {
    const el = document.querySelector('.fb-pointer__core')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

export default function LandingPage() {
    const ENABLE_PRESAVE = false;
    const ENABLE_UPCOMING = false;
    const ENABLE_SIGNUP = true;
    const ENABLE_CHATBOT = true;

    // FALLA/BOCONÓ: 'closed' | 'opening' | 'open'. La transición (run) es independiente.
    const [falla, setFallaState] = useState(() => (isFallaHash() ? 'open' : 'closed'))
    const [fallaRun, setFallaRunState] = useState(null)
    const fallaRef = useRef(falla)
    const runRef = useRef(null)
    const fallaSeenRef = useRef(falla !== 'closed')
    const setFalla = (v) => { fallaRef.current = v; setFallaState(v) }
    const setFallaRun = (v) => { runRef.current = v; setFallaRunState(v) }

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

    // Tour data (fetched from Google Sheet API via Cloudflare Worker & geocoded, passed to RadarMap)
    const [tourDates, setTourDates] = useState([])
    const [tourLoading, setTourLoading] = useState(true)
    const geoCache = useRef({})

    // Coordenadas conocidas para preservar todos los puntos de la gira (incluso en fallback)
    const KNOWN_COORDINATES = {
        'Cuautitlan Izcalli, Mex': { lat: 19.6700, lng: -99.2100 },
        'Puebla, Mex': { lat: 19.0414, lng: -98.2063 },
        'Toluca, Mex': { lat: 19.2826, lng: -99.6557 },
        'Monterrey, Mex': { lat: 25.6866, lng: -100.3161 },
        'Leon, Mex': { lat: 21.1221, lng: -101.6826 },
        'Guadalajara, Mex': { lat: 20.6597, lng: -103.3496 },
        'CDMX': { lat: 19.4326, lng: -99.1332 },
        'Madrid, España': { lat: 40.4168, lng: -3.7038 },
        'Barcelona, España': { lat: 41.3879, lng: 2.1699 },
        'Berlin, Alemania': { lat: 52.5200, lng: 13.4050 },
        'Londres, UK': { lat: 51.5074, lng: -0.1278 },
        'Lima, Peru': { lat: -12.0464, lng: -77.0428 },
        'Santiago, Chile': { lat: -33.4489, lng: -70.6693 },
        'Buenos Aires, Argentina': { lat: -34.6037, lng: -58.3816 },
        'Bogotá, Colombia': { lat: 4.7110, lng: -74.0721 },
        'Miami, USA': { lat: 25.7617, lng: -80.1918 },
    }

    useEffect(() => {
        const tourApiUrl = import.meta.env.VITE_TOUR_API_URL
        const geocodingApiKey = import.meta.env.VITE_OPENCAGE_KEY

        const fallbackParsed = (events || []).map((ev, i) => {
            const parts = ev.city.split(',').map(s => s.trim())
            const city = parts[0] || ''
            const country = parts.slice(1).join(', ') || ''
            const coords = KNOWN_COORDINATES[ev.city] || KNOWN_COORDINATES[city]
            return {
                id: `event-${i}`,
                city,
                country,
                date: ev.date,
                rawDate: ev.date,
                ticketUrl: ev.link,
                cityKey: ev.city,
                lat: coords ? coords.lat : null,
                lng: coords ? coords.lng : null
            }
        })

        if (!tourApiUrl) {
            setTourDates(fallbackParsed)
            setTourLoading(false)
            return
        }

        let cancelled = false
        async function fetchAndGeocode() {
            try {
                const res = await fetch(tourApiUrl)
                const data = await res.json()
                if (data && 'progreso' in data) setLiveRaisedUSD(data.progreso)
                const raw = data.tourDates || []
                if (raw.length === 0) {
                    if (!cancelled) setTourDates(fallbackParsed)
                    return
                }

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
                        if (KNOWN_COORDINATES[cityKey]) {
                            geoCache.current[cityKey] = KNOWN_COORDINATES[cityKey]
                            return
                        }
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
                    const coords = geoCache.current[r.cityKey] || KNOWN_COORDINATES[r.cityKey]
                    return coords ? { ...r, lat: coords.lat, lng: coords.lng } : r
                })

                setTourDates(final.length > 0 ? final : fallbackParsed)
            } catch {
                if (!cancelled) setTourDates(fallbackParsed)
            } finally {
                if (!cancelled) setTourLoading(false)
            }
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

    // Deep link (#falla-bocono): deja el radar en el historial para que "atrás" vuelva a él
    useEffect(() => {
        if (!isFallaHash() || window.history.state?.fb) return
        window.history.replaceState(null, '', baseUrl())
        window.history.pushState({ fb: true }, '', baseUrl() + FALLA_HASH)
    }, [])

    const openFalla = useCallback((origin, { fromHistory = false } = {}) => {
        if (runRef.current || fallaRef.current !== 'closed') return
        if (!fromHistory) window.history.pushState({ fb: true }, '', baseUrl() + FALLA_HASH)
        fallaSeenRef.current = true
        setOpenSignup(false)
        setFalla('opening')
        setFallaRun({ id: Date.now(), mode: 'open', origin: origin || pointerOrigin() })
    }, [])

    const closeFalla = useCallback(({ fromHistory = false } = {}) => {
        if (runRef.current || fallaRef.current !== 'open') return
        if (!fromHistory) {
            // Si entramos desde el radar, retroceder mantiene el historial limpio
            if (window.history.state?.fb) { window.history.back(); return }
            window.history.replaceState(null, '', baseUrl())
        }
        setFallaRun({ id: Date.now(), mode: 'close', origin: pointerOrigin() })
    }, [])

    useEffect(() => {
        const onPop = () => {
            if (isFallaHash()) openFalla(null, { fromHistory: true })
            else closeFalla({ fromHistory: true })
        }
        window.addEventListener('popstate', onPop)
        return () => window.removeEventListener('popstate', onPop)
    }, [openFalla, closeFalla])

    const handleCrumpleCovered = useCallback((run) => {
        setFalla(run.mode === 'open' ? 'open' : 'closed')
    }, [])

    const handleCrumpleDone = useCallback(() => {
        setFallaRun(null)
        // Si el usuario navegó (atrás/adelante) durante la animación, sincroniza con la URL
        const wantOpen = isFallaHash()
        if (wantOpen && fallaRef.current === 'closed') openFalla(null, { fromHistory: true })
        else if (!wantOpen && fallaRef.current === 'open') closeFalla({ fromHistory: true })
    }, [openFalla, closeFalla])

    const handleOpenFallaBocono = useCallback((origin) => openFalla(origin), [openFalla])
    const handleCloseFallaBocono = useCallback(() => closeFalla(), [closeFalla])

    useEffect(() => {
        const timer = setTimeout(() => {
            // No interrumpir a quien llega (o ya entró) a FALLA/BOCONÓ
            if (fallaSeenRef.current) return
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
                    onOpenFallaBocono={handleOpenFallaBocono}
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
            <BentoWidget />

            {falla === 'closed' && (
                <FallaBoconoDock onOpen={handleOpenFallaBocono} />
            )}

            {falla !== 'closed' && (
                <FallaBoconoExperience
                    onClose={handleCloseFallaBocono}
                    hidden={falla === 'opening'}
                />
            )}

            <CrumpleTransition
                run={fallaRun}
                onCovered={handleCrumpleCovered}
                onDone={handleCrumpleDone}
            />
        </div>
    )
}
