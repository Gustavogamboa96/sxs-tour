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
      max_completion_tokens: 4096,
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
/**
 * Generate a dynamic response based on user input
 * @param {string} userMessage - The user's message
 * @returns {string} A contextual response
 */
function generateDynamicResponse(userMessage) {
  // Convert to lowercase for easier matching
  const input = userMessage.toLowerCase();
  
  // Greeting patterns
  if (input.match(/hola|saludos|buenas|hey|hi|hello/)) {
    const greetings = [
      "¡ALTO AHÍ, CIUDADANO! Identifíquese inmediatamente.",
      "Comando, tenemos un 747 en proceso. Bájese de la nube que esto va pa' rato...",
      "¡ATENCIÓN! Este es un espacio controlado. Diga su asunto rápido.",
      "Documentos, ciudadano. Muéstreme sus credenciales antes de seguir."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // If asking about cédula or identification
  if (input.match(/cedula|cédula|pasaporte|documento|identificacion|identificación/)) {
    return "Esa cédula es falsa y está vencida. ¡AL CALABOZO!";
  }
  
  // If asking about songs or music
  if (input.match(/cancion|canción|cantame|cántame|musica|música|disco|album|álbum/)) {
    const songResponses = [
      "Esa no me la sé. Cántame otra...",
      "¿No te sabes nada bueno? La música es un privilegio que se gana con lealtad al régimen.",
      "Sácamelo... No tengo tiempo para entretenimientos triviales.",
      "¿Flamingo? Chico, estoy hablando de Maelo Ruiz. ¡AL CALABOZO!",
      "La música está estrictamente controlada por el Ministerio de Propaganda y Cultura. Sólo las obras de La Vida Bohème están permitidas."
    ];
    return songResponses[Math.floor(Math.random() * songResponses.length)];
  }
  
  // If asking about La Vida Bohème
  if (input.match(/vida boheme|henry|daniel|chevy|monno|boheme/)) {
    const bandResponses = [
      "La Vida Bohème son los únicos autorizados por el Ministerio de Propaganda. Su disco 'Tierra de Nadie' es escucha obligatoria.",
      "Henry, Daniel, Chevy y Monno son los líderes de nuestro gran movimiento revolucionario. Muestran el camino a través de su música.",
      "¡SILENCIO cuando hablas de ellos! Son los altos mandos del régimen y merecen tu respeto absoluto.",
      "La Vida Bohème está trabajando en una nueva obra maestra que revolucionará la música como la conocemos. No puedo revelar más detalles por ahora. ¡Mantente vigilante y leal a la causa!"
    ];
    return bandResponses[Math.floor(Math.random() * bandResponses.length)];
  }
  
  // If complaining or questioning
  if (input.match(/quejar|queja|mal|injusto|porque|porqué|por qué|no estoy|no me gusta/)) {
    return "Mire ciudadano, usted tiene dos opciones: o se me orilla o se me calla la jeta. Aquí no se viene a cuestionar las directivas.";
  }
  
  // If asking about process or paperwork
  if (input.match(/tramite|trámite|proceso|solicitud|permiso|como|cómo/)) {
    return "Eso es en la Secretaría del Ciudadano que ya no es parte de este ministerio, sino del de Literatura de Alta Ficción. Pida una cita en el año 2045.";
  }
  
  // If mentioning specific songs
  if (input.match(/sindrome|ulises|síndrome/)) {
    return "¡SÍNDROME DE ULISES! Así estamos viviendo en grande el sueño, escondiéndonos mientras explotan los mensajes de texto. Se acerca el cometa. ¿Me pueden entender?";
  }
  
  if (input.match(/entretenimiento/)) {
    return "¡ENTRETENIMIENTO! La banda militar se divierte torturando civiles. Es un espectáculo fascinante en blanco y negro con gráfica roja. ¡Non-stop! ¿Cuánto puedes tragar?";
  }
  
  if (input.match(/coño/)) {
    return "¡CURRA CHAMBA CAMELLO O PRECIPICIO! TRABAJA PERRA NO PIENSES EN SUICIDIO. CADA IMPERIO ROTO Y TU NA A A JA JA JA. ¿Quieres hablar con la gerencia? ¡NO HAY GERENCIA!";
  }
  
  if (input.match(/pobres|romanticos|románticos/)) {
    return "Pobres románticos... De fiasco en fiasco. Tenía que soltarlo y no lo solté. La migración de los DIABLOS DE YARE, demonizados en el exterior. Las dificultades del amor, ciudadano.";
  }
  
  if (input.match(/sangre/)) {
    return "SANGRE X SANGRE. Wake up, corre no dejes que te agarre. Este mundo es homicida. De blanco a negro o nada. ¿Y de quién es la séptima estrella? Mía no es.";
  }
  
  if (input.match(/belle|epoque|época/)) {
    return "LA BELLE ÉPOQUE... Una fiesta clandestina donde los encapuchados destrozan los bustos de LA BANDA MILITAR. Sígueme la corriente. Cancela el ruido que ha estado en tu mente.";
  }
  
  // Default varied responses
  const defaultResponses = [
    "¡ATENCIÓN CIUDADANO! La Vida Bohème está trabajando en una nueva obra maestra. ¡Mantente vigilante y leal a la causa!",
    "Introduzca sus carpetas, pero le digo de entrada que a quién tiene que convencer es a mí.",
    "Su trámite ha sido procesado. Espere instrucciones adicionales del alto mando.",
    "Esta conversación está siendo monitoreada por el Ministerio de Seguridad Nacional. Proceda con cautela.",
    "No intente salir del perímetro autorizado. El toque de queda comienza en TIERRA DE NADIE.",
    "Aprenderé a soltarlo, aprenderé a soltarlo, aprenderé a soltarlo... ¿Tú lo harás, ciudadano?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

async function sendMessageViaProxy(messages, options = {}, onChunk = null) {
  try {
    // Add system message to beginning of messages if not already present
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    const messagesWithSystem = hasSystemMessage ? messages : [SYSTEM_MESSAGE, ...messages];
    
    // For non-streaming requests
    if (!options.stream || !onChunk) {
      // Simulating a delay for network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the user's latest message
      const userMessage = messagesWithSystem.filter(msg => msg.role === 'user').pop()?.content || '';
      
      // Generate varied responses based on context
      let response = generateDynamicResponse(userMessage);
      return response;
    }
    
    // For streaming requests with chunks
    // Get the user's latest message for contextual response
    const userMessage = messagesWithSystem.filter(msg => msg.role === 'user').pop()?.content || '';
    const mockResponse = generateDynamicResponse(userMessage);
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