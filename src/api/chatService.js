import { Groq } from 'groq-sdk';
import { instructions } from './instructions.js';

// Utility for safe feature detection
const isBrowser = typeof window !== 'undefined';

// Create a singleton Groq client instance
let groqClient = null;

/**
 * Initialize the Groq client with an API key
 * @param {string} apiKey - The Groq API key
 */
export const initGroqClient = (apiKey) => {
  if (!groqClient) {
    groqClient = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
  }
  return groqClient;
};

/**
 * Get the singleton Groq client instance, initializing it if necessary
 * @returns {Groq} The Groq client instance
 */
export const getGroqClient = () => {
  if (!groqClient) {
    // Use environment variable if available, otherwise throw an error
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not found. Please set REACT_APP_GROQ_API_KEY environment variable.');
    }
    groqClient = new Groq({
      apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
  }
  return groqClient;
};

// System message to provide context for all conversations
const SYSTEM_MESSAGE = {
  role: "system",
  content: instructions
};

/**
 * Send a message to the Groq API and get a response
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Options for the API call
 * @param {Function} onChunk - Callback function for streaming responses
 * @returns {Promise<string>} The complete response text
 */
export const sendMessage = async (messages, options = {}, onChunk = null) => {
  try {
    // For browser environments, we'll need to use a proxy API endpoint
    if (typeof window !== 'undefined') {
      return await sendMessageViaProxy(messages, options, onChunk);
    }

    // Server-side execution continues with direct Groq API usage
    const groq = getGroqClient();
    
    // Add system message to beginning of messages if not already present
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    const messagesWithSystem = hasSystemMessage ? messages : [SYSTEM_MESSAGE, ...messages];
    
    const defaultOptions = {
      model: "gemma2-9b-it",
      temperature: 0.9,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: Boolean(onChunk),
      stop: null
    };
    
    const requestOptions = { ...defaultOptions, ...options, messages: messagesWithSystem };
    
    // If streaming is enabled and callback is provided
    if (requestOptions.stream && onChunk) {
      const chatCompletion = await groq.chat.completions.create(requestOptions);
      
      let fullResponse = '';
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        onChunk(content);
      }
      return fullResponse;
    } 
    // Non-streaming response
    else {
      requestOptions.stream = false;
      const response = await groq.chat.completions.create(requestOptions);
      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
};

/**
 * Send a message via a proxy API endpoint for browser environments
 * This avoids exposing API keys in the browser
 * @param {Array} messages - Array of message objects
 * @param {Object} options - Options for the API call
 * @param {Function} onChunk - Callback for streaming responses
 * @returns {Promise<string>} The complete response text
 */
async function sendMessageViaProxy(messages, options = {}, onChunk = null) {
  try {
    // Add system message to beginning of messages if not already present
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    const messagesWithSystem = hasSystemMessage ? messages : [SYSTEM_MESSAGE, ...messages];
    
    // For non-streaming requests
    if (!options.stream || !onChunk) {
      // Mock response for testing - replace with actual API call
      // Simulating a delay for network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return "¡ATENCIÓN CIUDADANO! He recibido tu mensaje. La Vida Bohème está trabajando en una nueva obra maestra que revolucionará la música como la conocemos. No puedo revelar más detalles por ahora. ¡Mantente vigilante y leal a la causa!";
    }
    
    // For streaming requests with chunks
    // Simulate streaming response for testing
    const mockResponse = "¡ATENCIÓN CIUDADANO! He recibido tu mensaje. La Vida Bohème está trabajando en una nueva obra maestra que revolucionará la música como la conocemos. No puedo revelar más detalles por ahora. ¡Mantente vigilante y leal a la causa!";
    let charIndex = 0;
    
    // Simulating a streaming response with chunks
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (charIndex >= mockResponse.length) {
          clearInterval(interval);
          resolve(mockResponse);
          return;
        }
        
        // Send 1-5 characters at a time to simulate streaming
        const chunkSize = Math.floor(Math.random() * 5) + 1;
        const chunk = mockResponse.substring(charIndex, charIndex + chunkSize);
        charIndex += chunkSize;
        
        if (chunk && onChunk) {
          onChunk(chunk);
        }
      }, 50); // Adjust timing for realistic streaming speed
    });
  } catch (error) {
    console.error("Error in proxy message handler:", error);
    throw error;
  }
}