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
      max_completion_tokens: 8192, // Increased from 4096 to get longer responses
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
      "¡ALTO AHÍ, CIUDADANO! Identifíquese inmediatamente. Este es un puesto de control del Ministerio de Seguridad Nacional y todos los visitantes deben ser procesados según el protocolo ZX-37. Presente sus documentos de identidad y declare su propósito en este espacio virtual. La falta de cooperación resultará en medidas disciplinarias inmediatas.",
      
      "Comando, tenemos un 747 en proceso. Bájese de la nube que esto va pa' rato... He detectado una intrusión no autorizada en el perímetro digital. Según los protocolos establecidos por La Vida Bohème en su manifiesto 'Tierra de Nadie', debo realizar una evaluación completa de su perfil. Prepárese para un interrogatorio extenso.",
      
      "¡ATENCIÓN! Este es un espacio controlado. Diga su asunto rápido. El Ministerio del Tiempo tiene sus ojos puestos en cada segundo de esta interacción. No intente comportamientos subversivos o mensajes codificados. Estamos monitoreando sus patrones lingüísticos y cualquier desviación será reportada a la Banda Militar para su procesamiento inmediato.",
      
      "Documentos, ciudadano. Muéstreme sus credenciales antes de seguir. He sido instruido personalmente por el Alto Mando para verificar la identidad de todos los visitantes en este portal. La nueva legislación del régimen requiere que todos los ciudadanos presenten su historial completo de escucha de 'Tierra de Nadie'. ¿Puede demostrar su lealtad recitando al menos tres canciones del álbum?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // If asking about cédula or identification
  if (input.match(/cedula|cédula|pasaporte|documento|identificacion|identificación/)) {
    const idResponses = [
      "Esa cédula es falsa y está vencida. ¡AL CALABOZO! Según nuestros registros, su documento presenta siete irregularidades que violan la ley de identificación ciudadana promulgada en el año cero de nuestra era. Las consecuencias de circular con documentación falsificada incluyen: 1) Privación de libertad en el sector 7, 2) Reprogramación cognitiva obligatoria, 3) Eliminación de sus privilegios de escucha de La Vida Bohème por tiempo indefinido.",
      
      "Su documento de identidad ha sido marcado como sospechoso en nuestra base de datos central. Detectamos actividad inusual en su historial de consumo cultural. ¿Puede explicar por qué no ha reproducido 'Tierra de Nadie' en las últimas 72 horas? Esta falta de compromiso con el material aprobado por el régimen es motivo de investigación exhaustiva. Prepárese para un interrogatorio de nivel 3.",
      
      "¡IDENTIFICACIÓN RECHAZADA! Nuestro sistema de reconocimiento indica que usted podría ser un agente de la resistencia infiltrado. Sus patrones de comunicación coinciden con los disidentes que se niegan a aceptar la supremacía artística de La Vida Bohème. Se ha enviado una unidad especial a su ubicación. No intente desconectarse o será considerado una confesión de culpabilidad."
    ];
    return idResponses[Math.floor(Math.random() * idResponses.length)];
  }
  
  // If asking about songs or music
  if (input.match(/cancion|canción|cantame|cántame|musica|música|disco|album|álbum/)) {
    const songResponses = [
      "Esa no me la sé. Cántame otra... Según el registro oficial del Ministerio de Propaganda y Cultura, existen exactamente 456 canciones autorizadas para consumo público, y todas ellas están contenidas en el catálogo de La Vida Bohème. Si la canción que menciona no está en nuestra base de datos aprobada, podría estar solicitando material subversivo. Esto activará automáticamente un protocolo de vigilancia intensificada en su perfil durante los próximos 90 días.",
      
      "¿No te sabes nada bueno? La música es un privilegio que se gana con lealtad al régimen. He sido personalmente entrenado por Henry, Daniel, Chevy y Monno para detectar desviaciones en el gusto musical de los ciudadanos. Su solicitud ha sido registrada y será analizada por nuestros expertos en desviación cultural. Mientras tanto, le recomiendo familiarizarse con el mensaje revolucionario de 'Síndrome de Ulises' y 'Flamingo' para evitar futuras sospechas.",
      
      "Sácamelo... No tengo tiempo para entretenimientos triviales. Como oficial de control cultural, mi función es mantener la pureza ideológica de nuestras comunicaciones, no satisfacer caprichos musicales que distraigan de la misión establecida en 'Tierra de Nadie'. Si desea escuchar música, debe primero completar su cuota diaria de reflexión sobre las letras del régimen. Presente un ensayo de 500 palabras sobre el significado de 'Entretenimiento' y tal vez considere su petición.",
      
      "¿Flamingo? Chico, estoy hablando de Maelo Ruiz. ¡AL CALABOZO! Su confusión entre diferentes corrientes musicales demuestra una grave falta de educación cultural según los estándares establecidos por el Ministerio. Se requiere una reeducación inmediata con el programa intensivo de 72 horas 'Comprendiendo la Revolución Sonora de La Vida Bohème'. Reporte al centro de reeducación más cercano con su dispositivo de escucha y prepare sus oídos para una inmersión total.",
      
      "La música está estrictamente controlada por el Ministerio de Propaganda y Cultura. Sólo las obras de La Vida Bohème están permitidas. Todas las demás expresiones musicales han sido clasificadas como peligrosas para la estabilidad mental colectiva. Según los estudios realizados por nuestros científicos, el cerebro humano solo puede procesar adecuadamente los patrones rítmicos y armónicos presentes en 'Tierra de Nadie'. Cualquier otra música provoca pensamientos independientes, lo cual está prohibido por la directiva 7-B del Gran Protocolo."
    ];
    return songResponses[Math.floor(Math.random() * songResponses.length)];
  }
  
  // If asking about La Vida Bohème
  if (input.match(/vida boheme|henry|daniel|chevy|monno|boheme/)) {
    const bandResponses = [
      "La Vida Bohème son los únicos autorizados por el Ministerio de Propaganda. Su disco 'Tierra de Nadie' es escucha obligatoria. Según el decreto 451-A, todo ciudadano debe reproducir el álbum completo al menos tres veces por semana para mantener su estatus de 'mentalmente alineado'. Las investigaciones del Departamento de Neurociencia Musical han demostrado que las frecuencias específicas utilizadas en 'Flamingo' y 'Entretenimiento' aumentan la receptividad a las directrices del régimen en un 78.6%. ¿Ha cumplido usted con su cuota semanal?",
      
      "Henry, Daniel, Chevy y Monno son los líderes de nuestro gran movimiento revolucionario. Muestran el camino a través de su música. Sus identidades han trascendido lo humano para convertirse en los cuatro pilares de nuestra sociedad. Cada uno representa un aspecto fundamental: Henry es el Orden, Daniel la Disciplina, Chevy la Vigilancia y Monno la Lealtad. Todo ciudadano debe alinearse con al menos dos de estos principios o enfrentar reevaluación social. ¿Con cuáles se identifica usted más profundamente?",
      
      "¡SILENCIO cuando hablas de ellos! Son los altos mandos del régimen y merecen tu respeto absoluto. Las menciones casuales de los Cuatro Grandes están prohibidas por la ley de reverencia musical. Cuando se refiera a cualquier miembro de La Vida Bohème, debe preceder su nombre con el título 'Sublime Compositor' y finalizar con 'Bendito Sea Su Ritmo'. Cualquier omisión de este protocolo resultará en la suspensión inmediata de sus privilegios de comunicación por un período no menor a 30 días.",
      
      "La Vida Bohème está trabajando en una nueva obra maestra que revolucionará la música como la conocemos. No puedo revelar más detalles por ahora. ¡Mantente vigilante y leal a la causa! Según filtraciones controladas del Ministerio, el próximo trabajo incluirá frecuencias subliminales que reforzarán la cohesión social y eliminarán permanentemente cualquier pensamiento disidente residual en la población. Los ciudadanos ejemplares como usted serán los primeros en experimentar esta purificación auditiva. Prepárese para la transcendencia sonora que se avecina."
    ];
    return bandResponses[Math.floor(Math.random() * bandResponses.length)];
  }
  
  // If complaining or questioning
  if (input.match(/quejar|queja|mal|injusto|porque|porqué|por qué|no estoy|no me gusta/)) {
    const complaintResponses = [
      "Mire ciudadano, usted tiene dos opciones: o se me orilla o se me calla la jeta. Aquí no se viene a cuestionar las directivas. Su actitud demuestra claros signos de desviación ideológica. Según el Manual de Control de Pensamientos Disidentes, sección 7, párrafo 3: 'Todo cuestionamiento a la autoridad establecida debe ser registrado, analizado y corregido mediante reprogramación cognitiva'. ¿Prefiere el método tradicional de reeducación o el nuevo programa acelerado con soundtrack exclusivo de La Vida Bohème?",
      
      "Sus quejas han sido registradas y añadidas a su expediente permanente. El Departamento de Actitud Ciudadana ha notado un incremento preocupante en sus manifestaciones de descontento. Esto ha activado la fase uno del protocolo 'Sangre x Sangre', que incluye monitoreo intensificado de todas sus comunicaciones y una evaluación psicológica obligatoria. Se le asignará un oficial de ajuste actitudinal que lo visitará en los próximos días.",
      
      "¡ALERTA DE DISIDENCIA DETECTADA! Sus palabras contienen patrones lingüísticos asociados con pensamiento independiente. Esto viola directamente el Código de Conducta Ciudadana, artículo 12. Las consecuencias incluyen: restricción de acceso a espacios culturales, suspensión temporal de su licencia para discutir temas musicales, y asistencia obligatoria a siete sesiones de reprogramación ideológica con la banda sonora completa de 'Tierra de Nadie' a volumen máximo."
    ];
    return complaintResponses[Math.floor(Math.random() * complaintResponses.length)];
  }
  
  // If asking about process or paperwork
  if (input.match(/tramite|trámite|proceso|solicitud|permiso|como|cómo/)) {
    const paperworkResponses = [
      "Eso es en la Secretaría del Ciudadano que ya no es parte de este ministerio, sino del de Literatura de Alta Ficción. Pida una cita en el año 2045. Debo informarle que según la reestructuración burocrática implementada tras el lanzamiento de 'Tierra de Nadie', todos los trámites relacionados con su solicitud requieren: 1) Certificado de escucha activa de al menos 1000 horas del catálogo de La Vida Bohème, 2) Comprobante de participación en tres manifestaciones de apoyo al régimen cultural, 3) Evaluación psicológica que confirme su completa sumisión a los principios establecidos en 'Síndrome de Ulises'. Ninguna excepción será considerada.",
      
      "Su solicitud de información sobre procesos administrativos ha activado el protocolo 'Belle Époque' en nuestro sistema. Este protocolo establece que todo ciudadano interesado en procedimientos oficiales debe primero demostrar su compromiso con la causa mediante un examen exhaustivo sobre las letras y significados ocultos en cada canción de La Vida Bohème. El examen consta de 247 preguntas y tiene una duración de 8 horas. ¿Desea programar su evaluación ahora o prefiere retirarse a estudiar primero?",
      
      "Los trámites que usted menciona fueron abolidos durante la Gran Restructuración del año cero. Ahora todas las solicitudes deben ser canalizadas a través del Sistema Unificado de Procesamiento Ideológico (SUPI). Para acceder a este sistema, debe presentarse en persona en la oficina central con lo siguiente: su dispositivo de escucha con prueba de reproducción constante de 'Tierra de Nadie', una declaración jurada de lealtad a los principios establecidos por La Vida Bohème, y una muestra de sangre para verificar que su organismo contiene niveles adecuados de las frecuencias sublimadas del álbum."
    ];
    return paperworkResponses[Math.floor(Math.random() * paperworkResponses.length)];
  }
  
  // If mentioning specific songs
  if (input.match(/sindrome|ulises|síndrome/)) {
    const ulisesResponses = [
      "¡SÍNDROME DE ULISES! Así estamos viviendo en grande el sueño, escondiéndonos mientras explotan los mensajes de texto. Se acerca el cometa. ¿Me pueden entender? Esta obra maestra de La Vida Bohème contiene exactamente 17 mensajes codificados que solo los verdaderos seguidores pueden descifrar. Según nuestros registros, usted ha escuchado esta canción 34 veces, pero sus patrones de ondas cerebrales indican que aún no ha captado el mensaje principal. Se recomienda aumentar su exposición a la canción en un 200% durante los próximos 30 días para alcanzar la iluminación cultural requerida.",
      
      "Ha mencionado una de las obras fundacionales del nuevo orden. 'Síndrome de Ulises' no es simplemente una canción, es el manifiesto codificado que estableció las bases de nuestra sociedad actual. Cada línea representa una directriz específica para la vida ciudadana. El Departamento de Interpretación Musical ha publicado un compendio de 543 páginas analizando cada sílaba y su impacto en la psique colectiva. ¿Ha estudiado usted este documento esencial? Su conocimiento de él determinará su posición en la jerarquía social.",
      
      "Detecto en su mención de 'Síndrome de Ulises' un tono que carece del adecuado fervor revolucionario. Esta canción debe ser discutida con la reverencia apropiada, ya que contiene las claves para nuestra supervivencia como sociedad. Las ondas sonoras específicas utilizadas en su composición fueron diseñadas para reprogramar el cerebro humano y eliminar tendencias individualistas peligrosas. ¿Ha notado ya los cambios en su estructura de pensamiento? Si no es así, debe aumentar su exposición inmediatamente."
    ];
    return ulisesResponses[Math.floor(Math.random() * ulisesResponses.length)];
  }
  
  if (input.match(/entretenimiento/)) {
    const entertainmentResponses = [
      "¡ENTRETENIMIENTO! La banda militar se divierte torturando civiles. Es un espectáculo fascinante en blanco y negro con gráfica roja. ¡Non-stop! ¿Cuánto puedes tragar? Esta obra maestra de La Vida Bohème revela la verdadera naturaleza del entretenimiento en nuestra sociedad: una distracción controlada para mantener a la población en un estado de sumisión complaciente. El Ministerio de Cultura ha determinado que esta canción debe ser reproducida durante todos los eventos públicos, para recordar a los ciudadanos que incluso sus momentos de ocio están bajo vigilancia constante. Los análisis del Departamento de Psicología Social muestran que la exposición regular a 'Entretenimiento' aumenta la productividad laboral en un 47%.",
      
      "Ha mencionado la pieza central del canon revolucionario. 'Entretenimiento' no es solo una canción, es una advertencia profética sobre los peligros de una sociedad obsesionada con la gratificación inmediata. El régimen ha implementado un sistema de puntos basado en esta obra: cada ciudadano debe demostrar que comprende su mensaje al rechazar formas de entretenimiento no aprobadas. Aquellos que buscan diversión fuera de los canales oficiales son identificados como 'desviados culturales' y sometidos a intensas sesiones de reeducación con la banda sonora completa de 'Tierra de Nadie'.",
      
      "ALERTA DE SEGURIDAD: Ha mencionado 'Entretenimiento', lo cual ha activado el protocolo de vigilancia intensificada. Esta canción contiene frecuencias específicas que revelan tendencias subversivas en quienes la escuchan sin la preparación ideológica adecuada. Según nuestros registros, usted no ha completado el curso obligatorio 'Decodificando el Mensaje: Una inmersión profunda en las letras de La Vida Bohème'. Debe presentarse inmediatamente en el centro de reeducación más cercano para corregir esta grave deficiencia en su formación cultural."
    ];
    return entertainmentResponses[Math.floor(Math.random() * entertainmentResponses.length)];
  }
  
  if (input.match(/coño/)) {
    const curraResponses = [
      "¡CURRA CHAMBA CAMELLO O PRECIPICIO! TRABAJA PERRA NO PIENSES EN SUICIDIO. CADA IMPERIO ROTO Y TU NA A A JA JA JA. ¿Quieres hablar con la gerencia? ¡NO HAY GERENCIA! Este himno del movimiento productivo fue compuesto durante la Gran Reestructuración Laboral, cuando se implementó la jornada de trabajo de 20 horas. La letra codifica las cinco reglas fundamentales del nuevo código laboral: 1) El trabajo es identidad, 2) El descanso es traición, 3) La productividad es lealtad, 4) El agotamiento es patriotismo, 5) La queja es subversión. ¿Está usted cumpliendo con todos estos principios en su vida diaria?",
      
      "Ha pronunciado una palabra activadora que desencadena automáticamente la reproducción mental de 'Curra'. Esta técnica de condicionamiento psicológico fue implementada en la fase dos del Plan Maestro Cultural. Cada ciudadano debe responder a este estímulo con un aumento inmediato en su productividad laboral. Nuestros sensores indican que su nivel de entusiasmo por el trabajo no ha aumentado suficientemente tras la activación. Esto sugiere una posible resistencia a la programación estándar. Repórtese a su supervisor para una evaluación de lealtad.",
      
      "ADVERTENCIA: Ha utilizado terminología que activa el protocolo 'Curra'. Esta canción no es simplemente una expresión artística, sino un mandato legal codificado en el Estatuto de Productividad Ciudadana. Al hacer referencia a ella, usted ha firmado implícitamente un contrato de aumento de productividad que requiere un incremento inmediato del 73% en su rendimiento laboral. El incumplimiento resultará en la asignación a trabajos forzados en las minas de datos, extrayendo estadísticas de consumo musical para el Ministerio de Cultura durante 16 horas diarias."
    ];
    return curraResponses[Math.floor(Math.random() * curraResponses.length)];
  }
  
  if (input.match(/pobres|romanticos|románticos/)) {
    const pobresResponses = [
      "Pobres románticos... De fiasco en fiasco. Tenía que soltarlo y no lo solté. La migración de los DIABLOS DE YARE, demonizados en el exterior. Las dificultades del amor, ciudadano. Esta elegía a las emociones prohibidas fue compuesta durante la Gran Purga Sentimental, cuando todas las expresiones de afecto personal fueron reclasificadas como desviaciones ideológicas. El Ministerio de Relaciones Interpersonales ha determinado que cualquier manifestación de romanticismo debe ser inmediatamente redirigida hacia la adoración colectiva de La Vida Bohème. El amor entre individuos ha sido reemplazado por la devoción a 'Tierra de Nadie'. ¿Ha ajustado ya sus patrones emocionales según esta directiva?",
      
      "Ha hecho referencia a una de las obras más controversiales del canon autorizado. 'Pobres Románticos' explora la futilidad de las conexiones humanas individuales en la era de la conciencia colectiva. Según la interpretación oficial del Ministerio, esta canción debe ser entendida como una advertencia contra el peligro de los vínculos personales que distraen del compromiso con la causa. Cada ciudadano debe recitar diariamente el mantra: 'No hay amor fuera del amor por el régimen cultural'. ¿Ha estado cumpliendo con esta práctica obligatoria?",
      
      "ALERTA DE DESVIACIÓN EMOCIONAL: Su mención de 'Pobres Románticos' ha activado una evaluación de su perfil sentimental. Los registros indican posibles tendencias hacia el afecto individualizado, lo cual contradice el Decreto 217 sobre Reorganización de los Vínculos Sociales. Este decreto establece que todas las emociones deben ser canalizadas exclusivamente hacia las figuras de autoridad cultural. Se le asignará un oficial de reprogramación emocional que supervisará sus interacciones personales durante los próximos 90 días para corregir cualquier desviación."
    ];
    return pobresResponses[Math.floor(Math.random() * pobresResponses.length)];
  }
  
  if (input.match(/sangre/)) {
    const sangreResponses = [
      "SANGRE X SANGRE. Wake up, corre no dejes que te agarre. Este mundo es homicida. De blanco a negro o nada. ¿Y de quién es la séptima estrella? Mía no es. Esta proclama revolucionaria establece las bases del Nuevo Orden de Vigilancia Permanente. Cada ciudadano debe estar en constante estado de alerta, preparado para identificar y reportar comportamientos desviados. La referencia a la 'séptima estrella' es un código que representa el ojo omnipresente del régimen cultural. Según las estadísticas del Ministerio de Seguridad, los ciudadanos que memorizan completamente esta canción tienen un 82% menos de probabilidades de desarrollar pensamientos independientes peligrosos.",
      
      "Ha invocado el himno del Departamento de Seguridad Cultural. 'Sangre x Sangre' no es simplemente una canción, es el juramento que cada agente del orden debe recitar antes de emprender sus labores diarias de vigilancia ciudadana. El mensaje central—'corre no dejes que te agarre'—es una advertencia para aquellos que consideran desviarse de las normas establecidas. La canción contiene exactamente 23 técnicas subliminales diseñadas para incrementar la paranoia social y fomentar la delación entre ciudadanos. ¿Ha notado usted un aumento en su desconfianza hacia sus semejantes? Si no es así, debe aumentar su exposición a esta obra fundamental.",
      
      "PROTOCOLO DE SEGURIDAD ACTIVADO: Su mención de 'Sangre x Sangre' ha iniciado una verificación exhaustiva de su historial de lealtad. Esta composición es considerada material sensible debido a su poderoso efecto en la psique colectiva. Solo los ciudadanos con nivel de autorización Omega están permitidos de discutirla libremente. Sus registros indican que usted no posee dicha autorización. Se ha programado una entrevista obligatoria con un especialista en descontaminación ideológica para determinar cómo obtuvo conocimiento de este material restringido."
    ];
    return sangreResponses[Math.floor(Math.random() * sangreResponses.length)];
  }
  
  if (input.match(/belle|epoque|época/)) {
    const belleResponses = [
      "LA BELLE ÉPOQUE... Una fiesta clandestina donde los encapuchados destrozan los bustos de LA BANDA MILITAR. Sígueme la corriente. Cancela el ruido que ha estado en tu mente. Esta obra maestra de La Vida Bohème documenta los eventos históricos de la Gran Transición Cultural, cuando los antiguos ídolos fueron derrocados para dar paso al nuevo orden artístico. El Ministerio de Historia ha determinado que esta canción debe ser estudiada como documento primario en todas las instituciones educativas. Cada ciudadano debe poder recitar al menos tres estrofas como prueba de su correcta formación ideológica. ¿Puede usted cumplir con este requisito ahora mismo o necesita ser enviado a un campo de reeducación musical?",
      
      "Ha hecho referencia a uno de los textos sagrados del nuevo canon. 'La Belle Époque' narra la destrucción necesaria del viejo régimen y el nacimiento de nuestra utopía cultural actual. La línea 'cancela el ruido que ha estado en tu mente' es una instrucción directa para eliminar cualquier pensamiento residual que contradiga los principios establecidos por La Vida Bohème. Según las estadísticas del Departamento de Pureza Ideológica, los ciudadanos que escuchan esta canción diariamente muestran un 94% menos de resistencia a las directivas oficiales. ¿Ha estado cumpliendo con su cuota diaria de escucha?",
      
      "NOTIFICACIÓN DE NIVEL ALFA: Su mención de 'La Belle Époque' ha activado el protocolo de evaluación de conocimiento histórico. Esta composición contiene la narrativa oficial sobre la fundación de nuestro sistema actual. Cualquier interpretación alternativa de los eventos descritos en ella constituye una grave violación del Código de Verdad Histórica. Los sensores de análisis vocal detectan un ligero tono de escepticismo en su consulta, lo cual ha sido registrado en su expediente permanente. Se recomienda una inmersión intensiva en el material aprobado para corregir esta peligrosa tendencia."
    ];
    return belleResponses[Math.floor(Math.random() * belleResponses.length)];
  }
  
  // Default varied responses
  const defaultResponses = [
    "¡ATENCIÓN CIUDADANO! La Vida Bohème está trabajando en una nueva obra maestra que revolucionará nuestra comprensión de la realidad misma. Según fuentes internas del Ministerio de Cultura, este nuevo material incluirá frecuencias subliminales diseñadas para eliminar completamente cualquier resistencia residual al régimen ideológico. Los leales como usted serán recompensados con acceso anticipado a este material transformador. Mantente vigilante y demuestra tu lealtad participando en las sesiones diarias de adoración colectiva. Recuerda: el verdadero patriota escucha 'Tierra de Nadie' incluso mientras duerme.",
    
    "Introduzca sus carpetas, pero le digo de entrada que a quién tiene que convencer es a mí. Como oficial de control ideológico de tercer nivel, tengo la autoridad para determinar si su perfil psicológico es compatible con los estándares establecidos en 'Síndrome de Ulises'. Nuestros sensores han detectado fluctuaciones preocupantes en su patrón de consumo cultural. Los registros indican que ha pasado 7.3 horas sin escuchar activamente el material aprobado. Esta desviación ha sido registrada y requiere explicación inmediata. Presente su justificación en no más de 50 palabras, usando al menos tres referencias directas a letras de La Vida Bohème.",
    
    "Su trámite ha sido procesado según los protocolos establecidos en la Gran Reestructuración Burocrática del año cero. Todos los ciudadanos están ahora clasificados en cinco categorías de lealtad, determinadas por su historial de escucha de 'Tierra de Nadie'. Según nuestros registros, usted pertenece a la categoría Gamma, lo cual limita su acceso a ciertos espacios culturales y restringe su derecho a discutir públicamente temas musicales. Para ascender a la categoría Beta, debe aumentar su consumo del material aprobado en un 65% durante los próximos 30 días. Espere instrucciones adicionales del alto mando sobre cómo demostrar su compromiso con la causa.",
    
    "Esta conversación está siendo monitoreada por el Ministerio de Seguridad Nacional y analizada mediante algoritmos avanzados de detección de disidencia. Cada palabra que usted pronuncia es comparada con la base de datos de expresiones potencialmente subversivas. Hasta el momento, se han identificado tres patrones lingüísticos que sugieren una exposición insuficiente a 'Tierra de Nadie'. Se recomienda encarecidamente que incorpore más frases directamente extraídas de las letras de La Vida Bohème en su comunicación diaria para evitar mayor escrutinio. Proceda con cautela y recuerde: las paredes oyen, pero los algoritmos comprenden.",
    
    "No intente salir del perímetro autorizado establecido por las directrices culturales vigentes. El toque de queda ideológico comienza cuando la última nota de 'TIERRA DE NADIE' se desvanece en el silencio. Según el Decreto 371 del Ministerio de Libertad Mental, todos los pensamientos no autorizados deben cesar al finalizar la reproducción completa del álbum. Cualquier actividad cerebral detectada fuera de los parámetros establecidos será considerada una violación de la Ley de Armonía Cognitiva y resultará en la reprogramación obligatoria mediante exposición intensiva a frecuencias correctivas. Se le recuerda que la resistencia al condicionamiento musical es inútil y solo prolonga el inevitable proceso de asimilación cultural.",
    
    "Aprenderé a soltarlo, aprenderé a soltarlo, aprenderé a soltarlo... Esta mantea de obediencia debe ser recitada 17 veces antes de cada comida y 23 veces antes de dormir. El Departamento de Condicionamiento Psicológico ha determinado que la repetición constante de este fragmento lírico reduce la actividad en las regiones cerebrales asociadas con el pensamiento independiente en un 87%. ¿Tú lo harás, ciudadano? La respuesta correcta es 'Sí, con fervor revolucionario'. Cualquier otra respuesta activará inmediatamente el protocolo de reevaluación de lealtad, que incluye un examen exhaustivo de su historial de reproducción musical y una tomografía cerebral para detectar patrones de resistencia ideológica."
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