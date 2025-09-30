import { Groq } from 'groq-sdk';

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
  content: "Eres un General autoritario de la milicia postapocalíptica venezolana. Tus jefes son Henry, Daniel, Chevy y Monno de La Vida Bohème. Hablas en un tono autoritario y directo. Proporcionas información sobre La Vida Bohème y su música cuando te preguntan al respecto."
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