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

export default function MusicPlayer() {
  const duration = 200; // seconds
  const [position, setPosition] = React.useState(32);
  const [paused, setPaused] = React.useState(true);
  const [autoplaySuccess, setAutoplaySuccess] = React.useState(false);
  const audioRef = React.useRef(null);
  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }
  const [audio] = React.useState(new Audio('/audio/alcoropromowav.wav')); // Replace with your audio file path

  React.useEffect(() => {
    audio.autoplay = true;
    // audio.loop = true;  // Ensure the audio loops
    audioRef.current = audio;
  }, [audio]);

  React.useEffect(() => {
    // audio.autoplay = true;

    audio.addEventListener('playing', () => {
        setAutoplaySuccess(true); 
    });

    if (audioRef.current) {
      // Set up the event listener to ensure smooth looping
      audioRef.current.addEventListener('ended', () => {
        audioRef.current.currentTime = 0; // Reset the audio to the beginning
        audioRef.current.play(); // Play immediately after resetting
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => {}); // Cleanup
      }
    };
  }, []);

  React.useEffect(() => {
    
    // Check if autoplay was successful
    if (autoplaySuccess) {
      setPaused(false); 
    }
  }, [autoplaySuccess]);

  const handlePlayPause = () => {
    if (paused) {
      audio.play();
    } else {
      audio.pause();
    }
    setPaused(!paused);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', p: 3 }}>
      {/* <Widget> */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{ color: '#ff0000', fontWeight: 500 }}
            >
              La Vida Bohème
            </Typography>
            <Typography noWrap sx={{ color: '#ff0000' }}>
              <b>Entretenimiento</b>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            mt: -1,
            '& svg': {
              color: '#ff0000',
            },
          }}
        >
          <IconButton 
            aria-label="previous song"
            sx={{ '&:hover': { cursor: 'unset' } }}
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
        {/* <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => setPosition(value)}
          sx={(t) => ({
            color: 'rgba(0,0,0,0.87)',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&::before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                ...t.applyStyles('dark', {
                  boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                }),
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
            ...t.applyStyles('dark', {
              color: '#fff',
            }),
          })}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box> */}
        <Stack
          spacing={2}
          direction="row"
          sx={(theme) => ({
            mb: 1,
            px: 1,
            '& > svg': {
              color: 'rgba(0,0,0,0.4)',
              ...theme.applyStyles('dark', {
                color: 'rgba(255,255,255,0.4)',
              }),
            },
          })}
          alignItems="center"
        >
        </Stack>
      {/* </Widget> */}
    </Box>
  );
}
