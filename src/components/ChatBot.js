import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { sendMessage } from '../api/chatService';
import '../styles/TerminalPlayer.css';
import '../styles/ChatBot.css';
import './Signup.css'; // Import fade animation styles

// Message types for styling
const MESSAGE_TYPE = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
  ERROR: 'error',
  TYPING: 'typing'
};

// Styled components borrowed and adapted from TerminalPlayer
const ChatOutput = styled('div')({
  fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  padding: '15px',
  whiteSpace: 'pre-wrap',
  color: 'white',
  height: '60vh',
  overflowY: 'auto',
  backgroundColor: '#212121',
  borderRadius: '4px 4px 0 0',
  fontSize: '16px',
  border: '2px solid #B71C1C',
  borderBottom: 'none',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#0f0f0f',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#B71C1C',
    borderRadius: '4px',
  },
});

const ChatInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: '#212121',
    fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    fontSize: '16px',
    borderRadius: '0 0 4px 4px',
    boxShadow: '0 0 20px rgba(183, 28, 28, 0.5)',
    '& fieldset': {
      borderColor: '#B71C1C',
      borderTopWidth: '0px',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#B71C1C',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B71C1C',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#B71C1C',
  },
});

const ChatBox = styled(Box)({
  width: '60%',
  maxWidth: '500px',
  position: 'relative',
  boxShadow: '0 0 20px rgba(183, 28, 28, 0.5)',
  borderRadius: '5px',
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  right: '10px',
  top: '10px',
  color: '#B71C1C',
  zIndex: 10,
});

const SendButton = styled(IconButton)({
  color: '#B71C1C',
});

// Message styling based on role
const MessageContainer = styled('div')(({ theme, messagetype }) => ({
  margin: '8px 0',
  padding: '8px',
  borderRadius: '8px',
  maxWidth: '85%',
  wordWrap: 'break-word',
  ...(messagetype === MESSAGE_TYPE.USER && {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    backgroundColor: 'rgba(183, 28, 28, 0.3)',
    color: 'white',
  }),
  ...(messagetype === MESSAGE_TYPE.ASSISTANT && {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
  }),
  ...(messagetype === MESSAGE_TYPE.ERROR && {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    color: '#ff6b6b',
  }),
  ...(messagetype === MESSAGE_TYPE.SYSTEM && {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#B71C1C',
    fontStyle: 'italic',
    width: '100%',
    textAlign: 'center',
  }),
}));

export default function ChatBot({ open, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatOutputRef = useRef(null);
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

  // Initialize chat with welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMessages = [
        "¡ALTO CIUDADANO! Este es un punto de control oficial. Identifíquese inmediatamente o será considerado una amenaza.",
        "COMANDO: Tenemos un 747 en proceso. Bájese de la nube que esto va pa' rato. Diga su asunto o será reportado.",
        "¡ATENCIÓN! Ha ingresado al sistema de comunicación directa con el alto mando de La Vida Bohème. Su actividad está siendo monitoreada."
      ];
      
      const welcomeMessage = {
        id: Date.now(),
        role: MESSAGE_TYPE.SYSTEM,
        content: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
      };
      setMessages([welcomeMessage]);
    }
  }, [open, messages.length]);

  // Auto-scroll to bottom of chat output
  useEffect(() => {
    if (chatOutputRef.current) {
      chatOutputRef.current.scrollTop = chatOutputRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle mobile keyboard and viewport adjustments
  useEffect(() => {
    if (!open) return;
    
    const handleResize = () => {
      if (window.innerWidth <= 768 && inputRef.current) {
        const inputElement = inputRef.current.querySelector('input');
        if (inputElement && document.activeElement === inputElement) {
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
            inputElement.scrollIntoView({ block: 'center' });
          }, 100);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);
  
  // Focus on input when modal opens
  useEffect(() => {
    if (open && inputRef.current && !isTyping) {
      setTimeout(() => {
        inputRef.current.querySelector('input')?.focus();
      }, 300);
    }
  }, [open, isTyping]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: MESSAGE_TYPE.USER,
      content: input
    };
    
    // Clear input field
    setInput('');
    
    // Update messages with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    try {
      // Set typing indicator
      setIsTyping(true);
      
      // Prepare conversation history for API
      const conversationHistory = messages
        .filter(msg => msg.role === MESSAGE_TYPE.USER || msg.role === MESSAGE_TYPE.ASSISTANT)
        .map(msg => ({
          role: msg.role === MESSAGE_TYPE.USER ? 'user' : 'assistant',
          content: msg.content
        }));
      
      // Add user's new message
      conversationHistory.push({
        role: 'user',
        content: input
      });
      
      // Create a placeholder for the assistant's response
      const assistantMessageId = Date.now() + 1;
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: assistantMessageId,
          role: MESSAGE_TYPE.ASSISTANT,
          content: ''
        }
      ]);
      
      // Call API with streaming response
      let fullResponse = '';
      let currentDisplayIndex = 0;
      
      await sendMessage(
        conversationHistory,
        { stream: true },
        (chunk) => {
          fullResponse += chunk;
          
          // Remove quotes from the response if they wrap the entire message
          let cleanResponse = fullResponse;
          if (cleanResponse.startsWith('"') && cleanResponse.endsWith('"') && cleanResponse.length > 2) {
            cleanResponse = cleanResponse.slice(1, -1);
          }
          
          // Don't update display immediately - let the interval handle it
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, fullContent: cleanResponse, content: cleanResponse.substring(0, currentDisplayIndex) }
                : msg
            )
          );
        }
      );
      
      // Create a typing effect that finishes in about 2 seconds
      const startTypingEffect = () => {
        const typingInterval = setInterval(() => {
          setMessages(prevMessages => {
            const assistantMsg = prevMessages.find(msg => msg.id === assistantMessageId);
            if (!assistantMsg || !assistantMsg.fullContent) {
              clearInterval(typingInterval);
              return prevMessages;
            }
            
            if (currentDisplayIndex >= assistantMsg.fullContent.length) {
              clearInterval(typingInterval);
              return prevMessages;
            }
            
            currentDisplayIndex++;
            const visibleContent = assistantMsg.fullContent.substring(0, currentDisplayIndex);
            
            // Create streaming version with character animation for new characters
            const streamedContent = [...visibleContent].map((char, i) => {
              const isNewChar = i === currentDisplayIndex - 1;
              return isNewChar 
                ? `<span class="streaming-character">${char}</span>`
                : char;
            }).join('');
            
            return prevMessages.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: visibleContent, streamingContent: streamedContent }
                : msg
            );
          });
        }, 15); // 15ms delay between each character for faster typing
      };
      
      // Start typing effect after a brief delay to ensure fullContent is set
      setTimeout(startTypingEffect, 100);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now() + 2,
          role: MESSAGE_TYPE.ERROR,
          content: `Error: ${error.message || 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.'}`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clean close of chat
  const handleClose = () => {
    setModalFaded(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="chat-bot-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: '16px', sm: 0 },
        overflow: 'auto',
      }}
      disableScrollLock={false}
      disableAutoFocus={true}
      BackdropProps={{
        className: "modal-backdrop"
      }}
    >
      <ChatBox
        sx={{
          width: { xs: '95%', sm: '80%' },
          maxHeight: { xs: '90vh', sm: 'none' },
          display: 'flex',
          flexDirection: 'column',
        }}
        className={`modal-content ${modalFaded ? 'modal-fade-in' : ''}`}
      >
        <CloseButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </CloseButton>
        
        <ChatOutput
          ref={chatOutputRef}
          sx={{
            height: { xs: '50vh', sm: '60vh' },
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.map(message => (
            <MessageContainer key={message.id} messagetype={message.role}>
              {message.role === MESSAGE_TYPE.ASSISTANT && message.streamingContent ? (
                <span dangerouslySetInnerHTML={{ __html: message.streamingContent }} />
              ) : (
                message.content
              )}
            </MessageContainer>
          ))}
          {isTyping && (
            <MessageContainer messagetype={MESSAGE_TYPE.TYPING}>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </MessageContainer>
          )}
        </ChatOutput>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ChatInput
            ref={inputRef}
            fullWidth
            variant="outlined"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            multiline
            maxRows={4}
            InputProps={{
              endAdornment: (
                <SendButton 
                  onClick={handleSendMessage}
                  disabled={isTyping || !input.trim()}
                >
                  <SendIcon />
                </SendButton>
              )
            }}
            sx={{
              marginTop: '-2px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#B71C1C !important',
              }
            }}
          />
        </Box>
      </ChatBox>
    </Modal>
  );
}