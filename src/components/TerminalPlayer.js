import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MusicPlayer from './MusicPlayer';
import '../styles/TerminalPlayer.css';

// Song mapping - Using the exact filenames from the public/audio directory
const SONGS = {
  'ULISES': {
    file: '01.wav',
    title: 'SÍNDROME DE ULISES'
  },
  'MIRA': {
    file: '02.wav',
    title: 'Entretenimiento!'
  },
  'OÑOC': {
    file: '03.wav',
    title: '¡COÑO!'
  },
  'CONO': {
    file: 'cono.wav',
    title: 'COÑO (Alternate)'
  },
  'NOTENIACARRO': {
    file: '04.wav',
    title: 'EL AMOR NO SE PIDE'
  },
  'ROMA': {
    file: '05.wav',
    title: 'POBRES ROMÁNTICOS'
  },
  'SANTAROSADELIMA': {
    file: '06.wav',
    title: 'Calle En El Cielo'
  },
  'WAKEUP': {
    file: '07.wav',
    title: 'SANGRE X SANGRE'
  },
  'GOLDENTEACHERS': {
    file: '08.wav',
    title: 'LA BELLE ÉPOQUE'
  },
  'UGAUGA': {
    file: '09.wav',
    title: 'Al Coro De Las Masas!'
  },
  'DOSHERMANOS': {
    file: '10.wav',
    title: 'TIERRA DE NADIE'
  },
  'FUMANCHU': {
    file: '11.wav',
    title: 'FUMANCHU'
  },
  'ALCORO': {
    file: 'alcoropromowav.wav',
    title: 'Al Coro Promo'
  }
};

// Help text - Will be dynamically updated when the component renders
const generateHelpText = (songs) => `
Comandos disponibles:
- [CANCIÓN]: Reproduce una canción escribiendo su nombre (ej., ULISES)
- PLAY [CANCIÓN]: Alternativa para reproducir una canción (ej., PLAY ULISES)
- STOP: Detiene la reproducción actual
- LIST: Muestra todas las canciones disponibles
- HELP: Muestra este mensaje de ayuda
- CLEAR: Limpia el terminal (no detiene la reproducción)
- EXIT: Cierra el terminal

Canciones disponibles:
${Object.keys(songs).map((key, index) => `${index + 1}. ${key} - ${songs[key].title}`).join('\n')}
`;

const TerminalOutput = styled('div')({
  fontFamily: 'monospace',
  padding: '10px',
  whiteSpace: 'pre-wrap',
  color: '#B71C1C', // Changed from #33ff33 to #B71C1C (MUI red)
  height: '60vh',
  overflowY: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  borderRadius: '4px 4px 0 0',
  fontSize: '16px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#0f0f0f',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#B71C1C', // Changed from #33ff33 to #B71C1C
    borderRadius: '4px',
  },
});

const TerminalInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#B71C1C', // Changed from #33ff33 to #B71C1C
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    caretColor: '#B71C1C', // Changed from #33ff33 to #B71C1C
    fontFamily: 'monospace',
    fontSize: '16px',
    borderRadius: '0 0 4px 4px',
    '& fieldset': {
      borderColor: '#B71C1C', // Changed from #33ff33 to #B71C1C
      borderTopWidth: '0px',
    },
    '&:hover fieldset': {
      borderColor: '#B71C1C', // Changed from #33ff33 to #B71C1C
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B71C1C', // Changed from #33ff33 to #B71C1C
    },
  },
  '& .MuiInputLabel-root': {
    color: '#B71C1C', // Changed from #33ff33 to #B71C1C
  },
});

const TerminalBox = styled(Box)({
  width: '80%',
  maxWidth: '700px',
  position: 'relative',
  boxShadow: '0 0 20px rgba(183, 28, 28, 0.5)', // Changed from rgba(51, 255, 51, 0.5) to rgba(183, 28, 28, 0.5)
  borderRadius: '5px',
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  right: '10px',
  top: '10px',
  color: '#B71C1C', // Changed from #33ff33 to #B71C1C
  zIndex: 10,
});

export default function TerminalPlayer({ open, onClose }) {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('¡Bienvenido al Terminal de Música de La Vida Bohème!\nEscribe HELP para ver los comandos disponibles.\nPrueba escribir "ALCORO" para reproducir una muestra.\n\n> ');
  const [currentSong, setCurrentSong] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const terminalOutputRef = useRef(null);
  const inputRef = useRef(null);

  // This state specifically manages whether the music player should be rendered
  // It's separate from currentSong which holds the song data
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [output, showMusicPlayer, errorMessage]);

  // Focus on input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [open]);

  // Empty focus handler - doesn't do anything special
  const handleInputFocus = () => {
    // We don't need to do anything special on focus
    // Just let the input get focused normally
  };

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };

  const processCommand = (cmd) => {
    const upperCmd = cmd.trim().toUpperCase();
    let response = '';
    
    // Reset error message when processing a new command
    setErrorMessage(null);

    if (upperCmd === 'HELP') {
      response = generateHelpText(SONGS);
    } else if (upperCmd === 'LIST') {
      response = 'Canciones disponibles:\n';
      Object.keys(SONGS).forEach((key, index) => {
        response += `${index + 1}. ${key} - ${SONGS[key].title}\n`;
      });
    } else if (upperCmd === 'CLEAR') {
      setOutput('Terminal limpiado.\n\n> ');
      // Don't clear currentSong, leave it playing
      return;
    } else if (upperCmd === 'EXIT') {
      handleClose();
      return;
    } else if (upperCmd.startsWith('PLAY ')) {
      // Support for legacy "PLAY" command format
      const songKey = upperCmd.substring(5).trim();
      if (SONGS[songKey]) {
        response = `Reproduciendo: ${SONGS[songKey].title}`;
        
        // Only change song if it's different from the current one
        if (!currentSong || currentSong.file !== SONGS[songKey].file) {
          // Update the current song without unmounting the player
          setCurrentSong(SONGS[songKey]);
          setShowMusicPlayer(true);
        }
      } else {
        response = `Canción no encontrada: ${songKey}. Escribe LIST para ver las canciones disponibles.`;
      }
    } else if (upperCmd === 'STOP') {
      // New command to explicitly stop the music
      response = `Deteniendo reproducción.`;
      setShowMusicPlayer(false);
      // Give time for player to clean up, then clear the song data
      setTimeout(() => {
        setCurrentSong(null);
      }, 100);
    } else if (Object.keys(SONGS).includes(upperCmd)) {
      // Direct song name input (without PLAY prefix)
      response = `Reproduciendo: ${SONGS[upperCmd].title}`;
      
      // Only change song if it's different from the current one
      if (!currentSong || currentSong.file !== SONGS[upperCmd].file) {
        // Update the current song without unmounting the player
        setCurrentSong(SONGS[upperCmd]);
        setShowMusicPlayer(true);
      }
    } else {
      response = `Comando no reconocido: ${cmd}. Escribe HELP para ver los comandos disponibles.`;
    }

    setOutput(prev => `${prev}${cmd}\n${response}\n\n> `);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Process the command without affecting audio unless it's a music control command
      processCommand(command);
      setCommand('');
    }
  };

  // Handle clean close of terminal
  const handleClose = () => {
    // First hide the music player
    setShowMusicPlayer(false);
    // Then clear song data after a short delay
    setTimeout(() => {
      setCurrentSong(null);
      // Then close the terminal
      if (onClose) {
        onClose();
      }
    }, 100);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="terminal-player-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TerminalBox>
        <CloseButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </CloseButton>
        
        <TerminalOutput ref={terminalOutputRef}>
          {output}
          {/* Hide error messages */}
          {/* {errorMessage && (
            <div className="terminal-error" style={{ color: '#FF0000', margin: '10px 0' }}>
              ERROR: {errorMessage}
            </div>
          )} */}
          {showMusicPlayer && currentSong && (
            <div className="terminal-player-container">
              <MusicPlayer 
                filename={currentSong.file} 
                title={currentSong.title} 
                terminalMode={true}
                onError={(error) => {
                  // Silently log errors but don't display them
                  console.log(`Audio error: ${error}`);
                  // Don't set error message in state
                  // setErrorMessage(`No se pudo reproducir ${currentSong.title}: ${error}`);
                }}
              />
            </div>
          )}
        </TerminalOutput>
        
        <TerminalInput
          ref={inputRef}
          fullWidth
          variant="outlined"
          placeholder="Enter command..."
          value={command}
          onChange={handleCommandChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          autoFocus
        />
      </TerminalBox>
    </Modal>
  );
}
