import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ChatBot from './ChatBot';

// Example usage component
export default function ChatBotExample() {
  const [openChat, setOpenChat] = useState(false);

  const handleOpenChat = () => {
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
  };

  return (
    <div>
      <Button
        onClick={handleOpenChat}
        variant="contained"
        sx={{
          backgroundColor: '#B71C1C',
          color: 'black',
          '&:hover': {
            backgroundColor: 'black',
            color: '#B71C1C',
            border: '1px solid #B71C1C',
          },
        }}
      >
        Hablar con el General
      </Button>
      
      <ChatBot 
        open={openChat}
        onClose={handleCloseChat}
      />
    </div>
  );
}