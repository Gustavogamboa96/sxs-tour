import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';

// R2 storage base URL for audio files
const AUDIO_BASE_URL = 'https://pub-888858389efa48b3b71fde9b5a222c27.r2.dev/audio';

const WallPaper = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&::before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background:
      'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)',
  },
  '&::after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background:
      'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    transform: 'rotate(30deg)',
  },
});

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(0,0,0,0.6)',
  }),
}));

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export default function MusicPlayer({ filename = 'alcoropromowav.wav', title = 'Entretenimiento', terminalMode = false, onError = null }) {
  const duration = 200; // seconds
  const [position, setPosition] = React.useState(32);
  const [paused, setPaused] = React.useState(true);
  const [autoplaySuccess, setAutoplaySuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const audioRef = React.useRef(null);
  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }
  
  // Create audio element with error handling
  const [audio, setAudio] = React.useState(null);
  const [audioError, setAudioError] = React.useState(false);
  
  // Initialize audio with error handling - SIMPLIFIED VERSION
  React.useEffect(() => {
    console.log('Creating audio for file:', filename);
    
    // Don't reset loading state if we're changing from loading to playing
    if (!audio) {
      setLoading(true);
    }
    setAudioError(false);
    
    // Only clean up previous audio if filename has changed
    if (audioRef.current && audioRef.current.src && !audioRef.current.src.includes(encodeURIComponent(filename))) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch (error) {
        console.log('Error cleaning up previous audio:', error);
      }
    } else if (audioRef.current && audioRef.current.src) {
      // If it's the same file, don't recreate the audio element
      console.log('Same audio file, skipping recreation');
      return;
    }
    
    // Create a new audio element with proper error handling
    try {
      const newAudio = new Audio(`${AUDIO_BASE_URL}/${filename}`);
      
      newAudio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        // Still set audioError state but don't show visual error
        setAudioError(true);
        setLoading(false);
        // Don't call onError to prevent error messages in the UI
        // if (onError) {
        //   onError(`Error loading audio file`);
        // }
      });
      
      newAudio.addEventListener('canplaythrough', () => {
        setLoading(false);
      });
      
      newAudio.addEventListener('playing', () => {
        setAutoplaySuccess(true);
        setPaused(false);
        // Make sure loading is set to false when playing starts
        setLoading(false);
      });
      
      // Set audio autoplay to true
      newAudio.autoplay = true;
      
      setAudio(newAudio);
      audioRef.current = newAudio;
      
      // Attempt to play the audio
      const playPromise = newAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error auto-playing audio:', error);
          // Don't call onError to prevent error messages in the UI
          // if (onError) {
          //   onError(`Error playing audio: ${error.message}`);
          // }
        });
      }
    } catch (error) {
      console.error('Error creating audio element:', error);
      setAudioError(true);
      setLoading(false);
      // Don't call onError to prevent error messages in the UI
      // if (onError) {
      //   onError(`Error creating audio element: ${error.message}`);
      // }
    }
    
    // Cleanup function
    return () => {
      // Only clean up if we're actually changing to a new song
      // This prevents cleanup during re-renders that don't change the song
      if (audioRef.current && (!filename || !audioRef.current.src.includes(encodeURIComponent(filename)))) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
        } catch (e) {
          console.log('Error during audio cleanup:', e);
        }
      }
    };
  }, [filename]);

  const handlePlayPause = () => {
    if (!audio) return;
    
    try {
      if (paused) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          // Don't show error in UI
        });
      } else {
        audio.pause();
      }
      setPaused(!paused);
    } catch (error) {
      console.error('Error in play/pause:', error);
      // Don't call onError to prevent error messages in the UI
      // if (onError) {
      //   onError(`Error controlling playback: ${error.message}`);
      // }
    }
  };

  const handleRewind = () => {
    if (!audio) return;
    
    try {
      audio.currentTime = 0; // Reset to start of the song
      if (paused) {
        audio.play().catch(error => {
          console.error('Error playing audio after rewind:', error);
          // Don't show error in UI
        });
        setPaused(false);
      }
    } catch (error) {
      console.error('Error in rewind:', error);
      // Don't call onError to prevent error messages in the UI
      // if (onError) {
      //   onError(`Error rewinding: ${error.message}`);
      // }
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      overflow: 'hidden', 
      position: 'relative', 
      p: 3,
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{ 
              color: terminalMode ? '#B71C1C' : '#B71C1C', 
              fontWeight: 600 
            }}
          >
            La Vida Bohème
          </Typography>
          <Typography noWrap sx={{ color: terminalMode ? '#B71C1C' : '#B71C1C' }}>
            <b>{title}</b>
          </Typography>
          {/* Don't show loading or error messages */}
          {/* {loading && !audioError && (
            <Typography 
              sx={{ 
                color: terminalMode ? '#B71C1C' : '#B71C1C', 
                fontSize: '0.8rem',
                marginTop: '4px'
              }}
            >
              Cargando audio...
            </Typography>
          )}
          {audioError && (
            <Typography 
              sx={{ 
                color: '#FF0000', 
                fontSize: '0.8rem',
                marginTop: '4px'
              }}
            >
              Error cargando audio
            </Typography>
          )} */}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
          marginTop: 0,
          '& svg': {
            color: terminalMode ? '#B71C1C' : '#B71C1C',
          },
        }}
      >
        <IconButton 
          aria-label="restart song"
          onClick={handleRewind}
          sx={{ '&:hover': { cursor: 'pointer' } }}
        >
          <FastRewindRounded fontSize="large" />
        </IconButton>
        <IconButton
          aria-label={paused ? 'play' : 'pause'}
          onClick={handlePlayPause}
          sx={{ '&:hover': { cursor: 'unset' } }}
        >
          {paused ? (
            <PlayArrowRounded sx={{ fontSize: '3rem' }} />
          ) : (
            <PauseRounded sx={{ fontSize: '3rem' }} />
          )}
        </IconButton>
        <IconButton 
          aria-label="next song"
          sx={{ '&:hover': { cursor: 'unset' } }}
        >
          <FastForwardRounded fontSize="large" />
        </IconButton>
      </Box>
      <Stack
        spacing={2}
        direction="row"
        sx={(theme) => ({
          mb: 1,
          px: 1,
          '& > svg': {
            color: 'rgba(0,0,0,0.4)',
            ...theme.applyStyles?.('dark', {
              color: 'rgba(255,255,255,0.4)',
            }),
          },
        })}
        alignItems="center"
      >
      </Stack>
    </Box>
  );
}
