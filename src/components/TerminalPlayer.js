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
import './Signup.css'; // Import fade animation styles

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
- [CANCIÓN]: Reproduce una canción escribiendo su nombre.
- SOS: Muestra este mensaje de ayuda
- CLEAR: Limpia el terminal (no detiene la reproducción)
- EXIT: Cierra el terminal`;

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
  border: '2px solid #B71C1C', // Match input border
  borderBottom: 'none', // No bottom border to connect seamlessly with input
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
    color: '#B71C1C',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    caretColor: 'transparent', // Hide default caret
    fontFamily: 'monospace',
    fontSize: '16px',
    borderRadius: '0 0 4px 4px',
    boxShadow: '0 0 20px rgba(183, 28, 28, 0.5)', // Exact match with TerminalBox
    '& fieldset': {
      borderColor: '#B71C1C',
      borderTopWidth: '0px',
      borderWidth: '2px', // Thicker border
    },
    '&:hover fieldset': {
      borderColor: '#B71C1C',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B71C1C',
      borderWidth: '2px', // Keep border width consistent when focused
    },
  },
  '& .MuiInputLabel-root': {
    color: '#B71C1C',
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
  const [output, setOutput] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const terminalOutputRef = useRef(null);
  const inputRef = useRef(null);
  const [modalFaded, setModalFaded] = useState(false);

  // Control modal fade effect
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setModalFaded(true);
      }, 100);
    } else {
      setModalFaded(false);
    }
  }, [open]);

  // This state specifically manages whether the music player should be rendered
  // It's separate from currentSong which holds the song data
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  // Animation speed for typing effect (milliseconds per character)
  const typingSpeed = 10; // Very quick typing speed

  // Add a flag to track when terminal is first opened
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Function to simulate typing effect with improved handling
  const simulateTyping = (text, callback) => {
    if (!text) {
      if (callback) callback();
      return;
    }

    setIsTyping(true);
    let displayedText = '';
    let i = 0;
    
    // Clear any existing intervals to prevent conflicts
    if (window.typingIntervalRef) {
      clearInterval(window.typingIntervalRef);
    }
    
    window.typingIntervalRef = setInterval(() => {
      displayedText += text.charAt(i);
      setOutput(displayedText);
      
      i++;
      if (i >= text.length) {
        clearInterval(window.typingIntervalRef);
        window.typingIntervalRef = null;
        setIsTyping(false);
        if (callback) callback();
      }
    }, typingSpeed);
  };

  // Handle mobile keyboard and viewport adjustments
  useEffect(() => {
    if (!open) return; // Only run when terminal is open
    
    // Function to handle resize events (including virtual keyboard appearance)
    const handleResize = () => {
      if (window.innerWidth <= 768 && inputRef.current) {
        const inputElement = inputRef.current.querySelector('input');
        if (inputElement && document.activeElement === inputElement) {
          // When input is focused and virtual keyboard likely appeared
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
            inputElement.scrollIntoView({ block: 'center' });
          }, 100);
        }
      }
    };
    
    // Add resize listener for keyboard appearance
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);
  
  // Initialize terminal with welcome message when opened
  useEffect(() => {
    if (open) {
      // Reset states
      setOutput('');
      setIsTyping(false);
      setIsFirstLoad(true);
      
      // Clear any existing typing intervals
      if (window.typingIntervalRef) {
        clearInterval(window.typingIntervalRef);
        window.typingIntervalRef = null;
      }
      
      // Start fresh with welcome message
      setTimeout(() => {
        simulateTyping('ALTO CIUDADANO\n\nBienvenido al sistema Terminal de La Vida Boheme\n\nEscribe SOS para ver los comandos disponibles\n> ', () => {
          setIsFirstLoad(false);
          // Focus the input after welcome message is done
          setTimeout(() => {
            const inputElement = inputRef.current?.querySelector('input');
            if (inputElement) inputElement.focus();
          }, 100);
        });
      }, 100);
    }
  }, [open]);

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [output]);
  
  // Clean up typing intervals when component unmounts
  useEffect(() => {
    return () => {
      if (window.typingIntervalRef) {
        clearInterval(window.typingIntervalRef);
        window.typingIntervalRef = null;
      }
    };
  }, []);
  
  // Focus on input when modal opens and after typing is complete
  useEffect(() => {
    if (open && inputRef.current && !isTyping && !isFirstLoad) {
      setTimeout(() => {
        // Focus specifically on the input element
        inputRef.current.querySelector('input').focus();
      }, 100);
    }
  }, [open, isTyping, isFirstLoad]);
  
  // Effect to scroll to input field on mobile devices
  useEffect(() => {
    // Function to check if device is mobile (based on screen width)
    const isMobileDevice = () => {
      return window.innerWidth <= 768; // Common breakpoint for mobile devices
    };

    // Function to scroll to input field
    const scrollToInput = () => {
      if (inputRef.current && isMobileDevice()) {
        // Get the input element
        const inputElement = inputRef.current.querySelector('input');
        if (inputElement) {
          // Focus the input element
          inputElement.focus();
          
          // Scroll the element into view with smooth behavior
          setTimeout(() => {
            inputElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }, 300); // Delay to ensure the modal is fully opened
        }
      }
    };

    // Scroll to input when terminal is opened and after typing is complete
    if (open && !isFirstLoad && !isTyping) {
      scrollToInput();
    }
  }, [open, isFirstLoad, isTyping]);
  
  // Additional effect to refocus after typing completes
  useEffect(() => {
    if (!isTyping && !isFirstLoad && inputRef.current) {
      // Focus specifically on the input element
      const inputElement = inputRef.current.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [isTyping, isFirstLoad]);

  // State to track the cursor visibility for blinking effect
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Effect to blink the cursor
  useEffect(() => {
    if (isTyping || isFirstLoad) return;
    
    const blinkInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500); // 500ms blink rate
    
    return () => clearInterval(blinkInterval);
  }, [isTyping, isFirstLoad]);
  
  // Compose the display value with a visible block cursor at the end
  const displayValue = !isTyping && !isFirstLoad && cursorVisible
    ? `${command}█`
    : command;

  // Focus handler - places cursor at the end and scrolls into view on mobile
  const handleInputFocus = (e) => {
    if (e.target) {
      setTimeout(() => {
        // Make sure we're working with the actual input element
        const inputElement = e.target.tagName === 'INPUT' ? 
          e.target : 
          inputRef.current?.querySelector('input');
        
        if (inputElement) {
          const length = inputElement.value.length;
          inputElement.setSelectionRange(length, length);
          
          // On mobile, ensure input is visible when focused
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }
        }
      }, 10);
    }
  };

  const handleCommandChange = (e) => {
    // Get the input value but remove the cursor character if it exists
    let value = e.target.value;
    if (value.endsWith('█')) {
      value = value.slice(0, -1);
    }
    // Remove any cursor characters that might be in the middle of the text
    value = value.replace(/█/g, '');
    setCommand(value);
  };

  const processCommand = (cmd) => {
    // Don't process commands while typing or during first load
    if (isTyping || isFirstLoad) return;
    
    // Make sure to remove any cursor character from the command
    const cleanCmd = cmd.replace(/█/g, '');
    const upperCmd = cleanCmd.trim().toUpperCase();
    let response = '';
    
    // Reset error message when processing a new command
    setErrorMessage(null);

    // Show command input immediately - make sure it's clean of cursor characters
    const cleanCommand = cleanCmd.replace(/█/g, '');
    const commandOutput = `${output}${cleanCommand}\n`;
    setOutput(commandOutput);

    if (upperCmd === 'SOS') {
      response = generateHelpText(SONGS);
    } else if (upperCmd === 'LIST') {
      response = 'Canciones disponibles:\n';
      Object.keys(SONGS).forEach((key, index) => {
        response += `${index + 1}. ${key} - ${SONGS[key].title}\n`;
      });
    } else if (upperCmd === 'CLEAR') {
      // Clear immediately and then start fresh typing
      setOutput('');
      setTimeout(() => {
        simulateTyping('Terminal limpiado.\n\n> ');
      }, 50);
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
      response = `Comando no reconocido: ${cmd}. Escribe SOS para ver los comandos disponibles.`;
    }

    // Start typing the response after a small delay
    setTimeout(() => {
      simulateTyping(`${response}\n\n> `);
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Only process command if not currently typing and command isn't empty
      if (!isTyping && !isFirstLoad && command.trim()) {
        // Clean any cursor characters from the command
        const cleanCommand = command.replace(/█/g, '');
        processCommand(cleanCommand);
        setCommand('');
      }
    }
  };

  // Handle clean close of terminal
  const handleClose = () => {
    // First fade out the modal
    setModalFaded(false);
    // Then hide the music player after a delay
    setTimeout(() => {
      setShowMusicPlayer(false);
      // Then clear song data after a short delay
      setTimeout(() => {
        setCurrentSong(null);
        // Then close the terminal
        if (onClose) {
          onClose();
        }
      }, 100);
    }, 300);
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
        padding: { xs: '16px', sm: 0 }, // Add padding on mobile
        overflow: 'auto', // Allow scrolling within modal
      }}
      disableScrollLock={false} // Enable scroll lock to prevent background scrolling
      disableAutoFocus={true} // Disable auto focus to let our custom focus handling work
      BackdropProps={{
        className: "modal-backdrop"
      }}
    >
      <TerminalBox
        sx={{
          width: { xs: '95%', sm: '80%' }, // Make it wider on mobile
          maxHeight: { xs: '90vh', sm: 'none' }, // Limit height on mobile
          display: 'flex',
          flexDirection: 'column',
        }}
        className={`modal-content ${modalFaded ? 'modal-fade-in' : ''}`}
      >
        <CloseButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </CloseButton>
        
        <TerminalOutput 
          ref={terminalOutputRef}
          sx={{
            height: { xs: '50vh', sm: '60vh' }, // Slightly shorter on mobile
            overflow: 'auto',
          }}
        >
          {output}
          {isTyping && <span className="typing-cursor">▋</span>}
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
          placeholder=""
          value={displayValue}
          onChange={handleCommandChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          autoFocus={!isTyping && !isFirstLoad}
          disabled={isTyping || isFirstLoad}
          InputProps={{
            autoFocus: true,
            classes: {
              input: 'terminal-input-field'
            }
          }}
          inputProps={{
            style: { 
              caretColor: 'transparent',
              padding: '14px' // Consistent padding
            }
          }}
          sx={{
            marginTop: '-2px', // Eliminate any gap between output and input
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#B71C1C !important', // Ensure border color consistency
            }
          }}
        />
      </TerminalBox>
    </Modal>
  );
}
