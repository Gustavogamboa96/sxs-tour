# ChatBot Integration Guide

This guide explains how to set up and use the ChatBot component in your React application.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root directory with your Groq API key:

```
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

### 2. Integration with Your Component

Import and use the ChatBot component in your desired page or component:

```jsx
import React, { useState } from 'react';
import ChatBot from './components/ChatBot';

function YourComponent() {
  const [openChat, setOpenChat] = useState(false);

  const handleOpenChat = () => setOpenChat(true);
  const handleCloseChat = () => setOpenChat(false);

  return (
    <div>
      <button onClick={handleOpenChat}>Open Chat</button>
      
      <ChatBot 
        open={openChat} 
        onClose={handleCloseChat} 
      />
    </div>
  );
}
```

## Customizing the ChatBot

### System Message

You can modify the system message that sets the tone and context for the AI by editing the `SYSTEM_MESSAGE` constant in `src/api/chatService.js`:

```javascript
const SYSTEM_MESSAGE = {
  role: "system",
  content: "Your custom system message here..."
};
```

### Styling

The ChatBot uses styling from:
- `src/styles/ChatBot.css` - Custom styling for chat bubbles and animations
- `src/styles/TerminalPlayer.css` - Base terminal styling
- `src/components/Signup.css` - Fade animations for modal

Modify these files to customize the appearance.

## Adding to LandingPage

To add the ChatBot to your LandingPage component:

1. Import the component:
```jsx
import ChatBot from './ChatBot';
```

2. Add state for managing the chat modal:
```jsx
const [openChat, setOpenChat] = useState(false);
```

3. Add handlers:
```jsx
const handleOpenChat = () => setOpenChat(true);
const handleCloseChat = () => setOpenChat(false);
```

4. Add a button to open the chat and the ChatBot component:
```jsx
<Button onClick={handleOpenChat}>Chat with General</Button>
<ChatBot open={openChat} onClose={handleCloseChat} />
```

## Advanced Features

### Message Persistence

To persist chat history between sessions, you can extend the ChatBot component to use localStorage:

```jsx
// At the beginning of your component
const savedMessages = localStorage.getItem('chatMessages');
const [messages, setMessages] = useState(savedMessages ? JSON.parse(savedMessages) : []);

// After messages update
useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }
}, [messages]);
```

### Custom Theme

You can create a different theme by modifying the styled components in `ChatBot.js`.