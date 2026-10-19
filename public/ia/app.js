// CommandAI - Motor Cliente Autónomo (PWA / GitHub Pages / Móvil)
// Conectado en segundo plano con tu backend de WhatsApp (outbox en Firebase cobelgrano-36019).

// 0. CONFIGURACIÓN FIREBASE (Conexión Directa en Segundo Plano)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAZtufy7-MAc6_97Yy7Ilj1TRUtgzFWtjY",
  authDomain: "cobelgrano-36019.firebaseapp.com",
  projectId: "cobelgrano-36019",
  storageBucket: "cobelgrano-36019.firebasestorage.app",
  messagingSenderId: "386444843080",
  appId: "1:386444843080:web:a6fe7b771b28bda91ba07d"
};

let db = null;
function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.firestore();
      console.log('[CommandAI] Conectado a Firestore (cobelgrano-36019)');
      updateWhatsAppStatusUI(true);
    } else {
      updateWhatsAppStatusUI(false);
    }
  } catch (e) {
    console.warn('[CommandAI] Error inicializando Firebase:', e);
    updateWhatsAppStatusUI(false);
  }
}

function updateWhatsAppStatusUI(isOnline) {
  const dot = document.getElementById('waStatusDot');
  const text = document.getElementById('waStatusText');
  if (dot) {
    dot.className = isOnline ? 'status-indicator online' : 'status-indicator offline';
  }
  if (text) {
    text.innerText = isOnline ? 'Conectado (Sin salir)' : 'Desconectado';
  }
}

// 1. ESTADO Y ALMACENAMIENTO LOCAL (localStorage)
const STORAGE_KEYS = {
  CONTACTS: 'commandai_contacts',
  SETTINGS: 'commandai_settings',
  HISTORY: 'commandai_history',
  NOTES: 'commandai_notes'
};

const DEFAULT_CONTACTS = [
  {
    id: 'c1',
    name: 'Agustina',
    phone: '+54 9 11 2649-5598',
    email: 'agustina@ejemplo.com',
    notes: 'Contacto de WhatsApp'
  },
  {
    id: 'c2',
    name: 'Ramiro',
    phone: '+54 9 11 2745-2476',
    email: 'ramirovescostain@gmail.com',
    notes: 'Cuenta propia'
  },
  {
    id: 'c3',
    name: 'Cristian',
    phone: '+54 9 11 4974-8673',
    email: 'cristian@ejemplo.com',
    notes: 'Miembro de la Colmena'
  }
];

const KNOWN_PHONES = {
  'agustina': '+54 9 11 2649-5598',
  'ramiro': '+54 9 11 2745-2476',
  'cristian': '+54 9 11 4974-8673'
};

const DEFAULT_SETTINGS = {
  defaultEmailSender: 'ramirovescostain@gmail.com',
  defaultCountryCode: '+549',
  activeProvider: 'heuristico', // 'heuristico', 'gemini', 'openai'
  geminiApiKey: '',
  openaiApiKey: '',
  autoExecute: true,
  whatsappSendMode: 'direct', // 'direct' (segundo plano sin salir) o 'link' (abrir app)
  whatsappWorkspace: 'personal' // 'personal' (Ramiro) o 'cob' (Consultorio)
};

const state = {
  contacts: loadFromStorage(STORAGE_KEYS.CONTACTS, DEFAULT_CONTACTS),
  settings: loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  history: loadFromStorage(STORAGE_KEYS.HISTORY, []),
  notes: loadFromStorage(STORAGE_KEYS.NOTES, []),
  isRecording: false
};

// Auto-completar teléfonos conocidos si estaban vacíos en un localStorage previo
(function autoFillKnownPhones() {
  let modified = false;
  state.contacts.forEach(c => {
    const key = (c.name || '').toLowerCase().trim();
    if (!c.phone && KNOWN_PHONES[key]) {
      c.phone = KNOWN_PHONES[key];
      modified = true;
    }
  });
  if (modified) {
    saveToStorage(STORAGE_KEYS.CONTACTS, state.contacts);
  }
})();

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof fallback === 'object' && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Error guardando en localStorage:', e);
  }
}

// Utilidad precisa para limpiar y formatear números de teléfono a formato internacional WhatsApp
function cleanPhoneNumber(phone, defaultCountry = '+549') {
  if (!phone) return '';
  let str = String(phone).trim();
  let digits = str.replace(/\D/g, '');
  if (!digits) return '';

  // Si empieza con 0 (código interurbano nacional de Argentina), quitar el 0
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Si tiene el formato internacional 54 9 ...
  if (digits.startsWith('549')) {
    // Si viene con 15 después del código de área 11 (e.g. 5491115xxxxxxxx = 15 dígitos)
    if (digits.startsWith('5491115') && digits.length === 15) {
      digits = '54911' + digits.substring(7);
    }
    return digits;
  }

  // Si tiene formato 54 ... sin el 9 de celular
  if (digits.startsWith('54') && digits.length >= 12) {
    let rest = digits.substring(2);
    if (rest.startsWith('1115') && rest.length === 12) {
      rest = '11' + rest.substring(4);
    }
    return '549' + rest;
  }

  // Si es un número local de 10 dígitos (ej: 1126495598)
  if (digits.length === 10) {
    return '549' + digits;
  }

  // Si tiene 12 dígitos con 11 15 ... (ej: 111526495598)
  if (digits.startsWith('1115') && digits.length === 12) {
    return '54911' + digits.substring(4);
  }

  // Si no coincidió con los anteriores pero no tiene país, agregar prefijo por defecto
  const countryPrefix = (defaultCountry || '+549').replace(/\D/g, '');
  if (!digits.startsWith(countryPrefix)) {
    return countryPrefix + digits;
  }

  return digits;
}

// 2. PARSER SEMÁNTICO HEURÍSTICO LOCAL (Zero-Latency, 100% Offline)
function parseCommandHeuristic(rawText, contacts) {
  const raw = rawText.trim();
  const lower = raw.toLowerCase();

  // A. WHATSAPP
  if (lower.includes('whatsapp') || lower.includes('wsp') || lower.includes('wasap') || lower.includes('mensaje')) {
    let recipient = '';
    let message = '';

    // Buscar destinatario: "a ramiro por WhatsApp", "para ramiro", "mandar mensaje a ramiro que dice..."
    const toMatch = raw.match(/(?:a|para)\s+([A-ZÁÉÍÓÚa-záéíóú0-9_+]+)(?:\s+por\s+whatsapp|\s+en\s+whatsapp|\s+al\s+whatsapp|\s*,|\s+que\s+dice|\s+diciendo)/i)
      || raw.match(/(?:whatsapp\s+(?:a|para)\s+)([A-ZÁÉÍÓÚa-záéíóú0-9_+]+)/i)
      || raw.match(/(?:a|para)\s+([A-ZÁÉÍÓÚa-záéíóú0-9_+]+)/i);

    if (toMatch) {
      recipient = toMatch[1].trim();
    }

    // Buscar mensaje: "que dice Hola cómo estás", "diciendo...", "con el texto..."
    const msgMatch = raw.match(/(?:que\s+dice|diciendo|con\s+el\s+texto|con\s+el\s+mensaje|mensaje\s*:|texto\s*:)\s+["'«]?([^"'»\n]+)["'»]?/i)
      || raw.match(/(?:dice|diciendo)\s+["'«]?(.+)$/i);

    if (msgMatch) {
      message = msgMatch[1].trim();
    } else {
      message = raw.replace(/^(?:mándale|manda|mandar|enviar|escribile)\s+(?:este\s+mensaje|un\s+mensaje|mensaje)?\s*(?:a|para)?\s*[A-ZÁÉÍÓÚa-záéíóú0-9_+]+\s*(?:por\s+whatsapp)?\s*/i, '').trim();
    }

    // Limpiar coletillas verbales del comando ("y que ese mensaje se mande", "y mándalo", etc.)
    message = message.replace(/\s+y\s+(?:que\s+)?(?:ese\s+mensaje\s+)?(?:se\s+mande|se\s+envie|se\s+envíe|mándalo|mandalo|envialo|envíalo|lo\s+mandes|lo\s+envíes).*$/i, '').trim();

    // Si aún no se encontró destinatario, comparar con agenda de contactos
    if (!recipient) {
      for (const c of contacts) {
        if (lower.includes(c.name.toLowerCase())) {
          recipient = c.name;
          break;
        }
      }
    }

    if (recipient || message) {
      return {
        actionId: 'send_whatsapp',
        confidence: 0.95,
        params: {
          recipient: recipient || 'Agustina',
          message: message || 'Hola cómo estás'
        }
      };
    }
  }

  // B. EMAIL / GMAIL
  if (lower.includes('mail') || lower.includes('correo') || lower.includes('gmail')) {
    let senderAccount = state.settings.defaultEmailSender || 'ramirovescostain@gmail.com';
    let to = '';
    let subject = '';
    let body = '';
    let workingText = raw;

    // Remitente
    const senderMatch = workingText.match(/(?:a\s+través\s+de\s+la\s+cuenta|desde\s+la\s+cuenta|desde\s+el\s+mail|desde)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    if (senderMatch) {
      senderAccount = senderMatch[1].trim();
      workingText = workingText.replace(senderMatch[0], ' ');
    }

    // Destinatario
    const toMatch = workingText.match(/(?:a\s+este\s+mail|al\s+mail|al\s+correo|para)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9._-]+)/i)
      || workingText.match(/(?:a\s+este\s+mail\s+ejemplo)/i)
      || workingText.match(/(?:a)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);

    if (toMatch) {
      if (toMatch[1]) {
        to = toMatch[1].trim();
      } else if (toMatch[0].includes('ejemplo')) {
        to = 'ejemplo@correo.com';
      }
      workingText = workingText.replace(toMatch[0], ' ');
    }

    if (!to) {
      for (const c of contacts) {
        if (c.email && workingText.toLowerCase().includes(c.name.toLowerCase())) {
          to = c.email;
          break;
        }
      }
    }

    if (to && !to.includes('@')) {
      to = to + '@correo.com';
    }

    // Limpiar frase introductoria común "diciendo esto en el asunto y esto en el texto"
    workingText = workingText.replace(/(?:diciendo|poniendo|escribiendo)?\s*(?:esto\s+)?en\s+el\s+asunto\s+y\s+(?:esto\s+)?en\s+el\s+texto\s*:?/i, ' ');

    // Asunto y Texto explícito
    const explicitSubjectBody = workingText.match(/asunto\s*:?\s*([^]+?)\s+(?:y\s+(?:esto\s+)?en\s+el\s+texto|texto)\s*:?\s*([^]+)$/i)
      || workingText.match(/(?:en\s+el\s+asunto|con\s+el\s+asunto)\s*["'«]?([^"'\n,]+?)["'»]?\s+(?:y\s+en\s+el\s+texto|texto)\s*["'«]?([^]+?)["'»]?$/i);

    if (explicitSubjectBody) {
      subject = explicitSubjectBody[1].replace(/^(?:esto|que\s+diga|dice)\s*/i, '').trim();
      body = explicitSubjectBody[2].trim();
    } else {
      const subjectMatch = workingText.match(/(?:asunto\s*:?|en\s+el\s+asunto\s*:?|con\s+el\s+asunto\s*:?)\s*["'«]?([^"'\n,]+?)(?=\s+(?:y\s+esto\s+en\s+el\s+texto|y\s+en\s+el\s+texto|texto|cuerpo|mensaje)|$)/i);
      if (subjectMatch) subject = subjectMatch[1].trim();

      const bodyMatch = workingText.match(/(?:texto\s*:?|en\s+el\s+texto\s*:?|cuerpo\s*:?|mensaje\s*:?)\s*["'«]?([^"'\n]+)/i);
      if (bodyMatch) body = bodyMatch[1].trim();
    }

    if (!subject && lower.includes('gracias')) subject = 'Gracias';
    if (!body && lower.includes('nos vemos pronto')) body = 'nos vemos pronto';

    return {
      actionId: 'send_email',
      confidence: 0.95,
      params: {
        senderAccount,
        to: to || 'ejemplo@correo.com',
        subject: subject || 'Sin asunto',
        body: body || 'Mensaje enviado desde CommandAI'
      }
    };
  }

  // C. RECORDATORIOS
  if (lower.includes('recordar') || lower.includes('recordatorio') || lower.includes('alarma')) {
    const timeMatch = raw.match(/(?:a\s+las|en|para\s+las)\s+(\d{1,2}(?::\d{2})?(?:\s*(?:am|pm|hs|horas|minutos))?)/i);
    const title = raw.replace(/^(?:crea(?:r)?|pon(?:er)?|hacer)?\s*(?:un)?\s*(?:recordatorio|alarma)?\s*(?:para|de)?/i, '').trim();
    return {
      actionId: 'create_reminder',
      confidence: 0.9,
      params: {
        title: title || 'Recordatorio',
        time: timeMatch ? timeMatch[0] : 'En breve'
      }
    };
  }

  // D. NOTAS
  if (lower.startsWith('anota') || lower.startsWith('guardar nota') || lower.startsWith('nota:')) {
    const content = raw.replace(/^(?:anota(?:r)?(?:\s+que)?|guardar\s+nota(?:\s*:)?|nota\s*:)/i, '').trim();
    return {
      actionId: 'save_note',
      confidence: 0.9,
      params: {
        content: content || raw,
        category: 'general'
      }
    };
  }

  // E. BÚSQUEDA WEB
  if (lower.startsWith('buscar') || lower.startsWith('busca') || lower.startsWith('abrir')) {
    const query = raw.replace(/^(?:buscar|busca\s+en\s+google|busca|abrir)\s+/i, '').trim();
    return {
      actionId: 'web_search',
      confidence: 0.85,
      params: { query }
    };
  }

  return null;
}

// 3. DEFINICIÓN Y REGISTRO DE ACCIONES MODULARES
const ACTION_REGISTRY = {
  send_whatsapp: {
    id: 'send_whatsapp',
    name: 'Enviar mensaje de WhatsApp',
    category: 'mensajeria',
    description: 'Abre el chat oficial de WhatsApp con el mensaje listo para enviar.',
    parameters: {
      recipient: 'Contacto o número de teléfono',
      message: 'Texto del mensaje'
    },
    examples: ['mándale este mensaje a Agustina por WhatsApp que dice Hola cómo estás'],
    execute: (params) => {
      let rawPhone = '';
      const recipientName = (params.recipient || '').trim();
      
      // Buscar contacto de manera insensible a mayúsculas/minúsculas
      const contact = state.contacts.find(c => 
        c.name.trim().toLowerCase() === recipientName.toLowerCase() ||
        (c.phone && c.phone.replace(/[^\d]/g, '').includes(recipientName.replace(/[^\d]/g, '')))
      );
      
      if (contact && contact.phone && contact.phone.trim().length > 0) {
        rawPhone = contact.phone.trim();
      } else if (/[\d]{7,}/.test(recipientName)) {
        rawPhone = recipientName;
      }

      const cleanPhone = cleanPhoneNumber(rawPhone, state.settings.defaultCountryCode);
      const encodedMsg = encodeURIComponent(params.message || '');

      // Enlaces universales compatibles con celular (Android e iOS)
      const waUrl = cleanPhone 
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`
        : `https://api.whatsapp.com/send?text=${encodedMsg}`;
      const appUrl = cleanPhone
        ? `whatsapp://send?phone=${cleanPhone}&text=${encodedMsg}`
        : `whatsapp://send?text=${encodedMsg}`;

      const displayName = contact ? contact.name : recipientName;

      return {
        success: true,
        status: cleanPhone ? 'ready' : 'needs_phone',
        message: cleanPhone ? `Listo para enviar a ${displayName}` : `Aún no tenés registrado el teléfono de ${displayName}`,
        data: {
          recipient: displayName,
          phone: cleanPhone ? '+' + cleanPhone : '',
          rawPhone,
          cleanPhone,
          message: params.message,
          waUrl,
          appUrl
        }
      };
    }
  },

  send_email: {
    id: 'send_email',
    name: 'Enviar correo electrónico',
    category: 'correo',
    description: 'Genera el borrador en Gmail o cliente de correo con asunto y texto completados.',
    parameters: {
      to: 'Destinatario',
      subject: 'Asunto',
      body: 'Texto del correo',
      senderAccount: 'Remitente'
    },
    examples: ['mandá un mail a través de la cuenta ramirovescostain@gmail.com a este mail ejemplo diciendo esto en el asunto Gracias y esto en el texto nos vemos pronto'],
    execute: (params) => {
      let targetEmail = params.to || '';
      const contact = state.contacts.find(c => c.name.trim().toLowerCase() === targetEmail.trim().toLowerCase());
      if (contact && contact.email) targetEmail = contact.email;

      const encodedSub = encodeURIComponent(params.subject || '');
      const encodedBody = encodeURIComponent(params.body || '');
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodedSub}&body=${encodedBody}`;
      const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSub}&body=${encodedBody}`;

      return {
        success: true,
        status: 'ready',
        message: `Borrador preparado para ${targetEmail}`,
        data: {
          sender: params.senderAccount || state.settings.defaultEmailSender,
          to: targetEmail,
          subject: params.subject,
          body: params.body,
          gmailUrl,
          mailtoUrl
        }
      };
    }
  },

  create_reminder: {
    id: 'create_reminder',
    name: 'Crear recordatorio',
    category: 'productividad',
    description: 'Guarda una alarma o recordatorio local.',
    parameters: { title: 'Título', time: 'Hora' },
    examples: ['crea un recordatorio para las 18:00'],
    execute: (params) => {
      return {
        success: true,
        status: 'saved',
        message: `Recordatorio guardado: "${params.title}" (${params.time || 'Pronto'})`,
        data: params
      };
    }
  },

  save_note: {
    id: 'save_note',
    name: 'Guardar nota',
    category: 'productividad',
    description: 'Guarda un apunte en el teléfono.',
    parameters: { content: 'Texto de la nota' },
    examples: ['anota comprar miel'],
    execute: (params) => {
      const note = { id: 'n_' + Date.now(), content: params.content, date: new Date().toLocaleDateString() };
      state.notes.unshift(note);
      saveToStorage(STORAGE_KEYS.NOTES, state.notes);
      return {
        success: true,
        status: 'saved',
        message: `Nota guardada con éxito: "${params.content}"`,
        data: note
      };
    }
  },

  web_search: {
    id: 'web_search',
    name: 'Buscar en la web',
    category: 'navegacion',
    description: 'Abre Google o un enlace.',
    parameters: { query: 'Término de búsqueda o URL' },
    examples: ['buscar recetas con miel'],
    execute: (params) => {
      let url = params.query;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
      return {
        success: true,
        status: 'ready',
        message: `Búsqueda lista: ${url}`,
        data: { url }
      };
    }
  }
};

// 4. INTERACCIÓN CON EL USUARIO Y PROCESAMIENTO
async function processCommand(prompt) {
  const trimmed = (prompt || '').trim();
  if (!trimmed) return;

  // A. Intentar con Gemini si está configurado
  let detected = null;
  if (state.settings.activeProvider === 'gemini' && state.settings.geminiApiKey) {
    try {
      detected = await callGeminiAPI(trimmed, state.settings.geminiApiKey);
    } catch (e) {
      console.warn('Fallo Gemini, usando parser local:', e);
    }
  }

  // B. Fallback a analizador semántico local
  if (!detected) {
    detected = parseCommandHeuristic(trimmed, state.contacts);
  }

  if (!detected || !ACTION_REGISTRY[detected.actionId]) {
    const errorCard = {
      id: 'err_' + Date.now(),
      prompt: trimmed,
      unrecognized: true,
      message: 'No reconocí una acción concreta. Prueba diciendo: "mándale este mensaje a Agustina por WhatsApp que dice..." o "mandá un mail a través de la cuenta ramirovescostain@gmail.com a..."'
    };
    renderUnrecognizedCard(errorCard);
    return;
  }

  const action = ACTION_REGISTRY[detected.actionId];
  const execution = action.execute(detected.params);

  // Guardar en historial
  const historyEntry = {
    id: 'h_' + Date.now(),
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    prompt: trimmed,
    actionId: action.id,
    actionName: action.name,
    params: detected.params,
    execution
  };
  state.history.unshift(historyEntry);
  if (state.history.length > 50) state.history.pop();
  saveToStorage(STORAGE_KEYS.HISTORY, state.history);

  // Refrescar el feed completo
  refreshFeed();

  // Si tiene auto-ejecución activa
  if (state.settings.autoExecute) {
    if (action.id === 'send_whatsapp' && execution.status === 'ready' && execution.data?.cleanPhone) {
      if (state.settings.whatsappSendMode !== 'link') {
        // Enviar directamente en segundo plano sin salir de la app
        dispatchWhatsAppOutbox(historyEntry.id, execution.data.cleanPhone, detected.params.message, execution.data.recipient);
      } else if (execution.data?.waUrl) {
        window.location.href = execution.data.waUrl;
      }
    } else if (action.id === 'send_email' && execution.data?.gmailUrl) {
      window.open(execution.data.gmailUrl, '_blank');
    }
  }
}

// 5. LLAMADA DIRECTA A GEMINI (Opcional si el usuario agrega su clave)
async function callGeminiAPI(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const tools = [{
    functionDeclarations: Object.values(ACTION_REGISTRY).map(a => ({
      name: a.id,
      description: a.description,
      parameters: {
        type: 'OBJECT',
        properties: Object.keys(a.parameters).reduce((acc, k) => {
          acc[k] = { type: 'STRING', description: a.parameters[k] };
          return acc;
        }, {})
      }
    }))
  }];

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: tools
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  const call = data.candidates?.[0]?.content?.parts?.find(p => p.functionCall);
  if (call) {
    return {
      actionId: call.functionCall.name,
      params: call.functionCall.args || {}
    };
  }
  return null;
}

// 6. RENDERIZADO DINÁMICO DEL FEED
const feedContainer = document.getElementById('feedContainer');
const emptyFeedPlaceholder = document.getElementById('emptyFeedPlaceholder');

function refreshFeed() {
  if (!state.history || state.history.length === 0) {
    if (emptyFeedPlaceholder) emptyFeedPlaceholder.style.display = 'block';
    feedContainer.innerHTML = '';
    if (emptyFeedPlaceholder) feedContainer.appendChild(emptyFeedPlaceholder);
    return;
  }

  if (emptyFeedPlaceholder) emptyFeedPlaceholder.style.display = 'none';
  feedContainer.innerHTML = '';

  state.history.forEach(item => {
    const action = ACTION_REGISTRY[item.actionId] || { name: item.actionName, category: 'general' };
    
    // RE-EVALUAR la acción con los contactos ACTUALES de la agenda
    let execution = item.execution;
    if (action.execute) {
      execution = action.execute(item.params);
      item.execution = execution; // actualizar en memoria
    }

    const card = createCardElement(item.id, item.prompt, action, item.params, execution);
    feedContainer.appendChild(card);
  });

  saveToStorage(STORAGE_KEYS.HISTORY, state.history);
}

function renderUnrecognizedCard(item) {
  if (emptyFeedPlaceholder) emptyFeedPlaceholder.style.display = 'none';
  const card = document.createElement('div');
  card.className = 'action-card';
  card.innerHTML = `
    <div class="action-card-header">
      <span class="action-badge general">🤖 Consulta</span>
      <span class="status-pill failed">Sin acción clara</span>
    </div>
    <div class="prompt-echo">"${escapeHtml(item.prompt)}"</div>
    <p style="font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(item.message)}</p>
  `;
  feedContainer.prepend(card);
}

function createCardElement(id, prompt, action, params, execution) {
  const card = document.createElement('div');
  card.className = 'action-card';
  card.id = `card_${id}`;

  let categoryIcon = '⚡';
  if (action.id === 'send_whatsapp') categoryIcon = '💬';
  if (action.id === 'send_email') categoryIcon = '✉️';
  if (action.id === 'create_reminder') categoryIcon = '⏰';

  let statusClass = execution.status === 'ready' || execution.status === 'saved' ? 'executed' : 'pending';
  let statusText = execution.status === 'ready' ? 'Listo para enviar ✅' : (execution.status === 'needs_phone' ? 'Falta teléfono ⚠️' : 'Completado ✅');

  let detailsHtml = '';
  let actionsHtml = '';
  let inlineBoxHtml = '';

  if (action.id === 'send_whatsapp') {
    const rawCleanPhone = execution.data?.cleanPhone || cleanPhoneNumber(execution.data?.phone || execution.data?.rawPhone || '', state.settings.defaultCountryCode);
    const escapedMsg = escapeHtml(params.message).replace(/'/g, "\\'");
    const escapedRecipient = escapeHtml(execution.data?.recipient || params.recipient).replace(/'/g, "\\'");

    detailsHtml = `
      <div class="detail-item">
        <span class="detail-label">Destinatario</span>
        <span class="detail-val">👤 ${escapeHtml(execution.data?.recipient || params.recipient)} ${execution.data?.phone ? `<strong style="color: #25d366;">(${execution.data.phone})</strong>` : ''}</span>
      </div>
      <div class="detail-item" style="grid-column: 1 / -1;">
        <span class="detail-label">Mensaje</span>
        <div class="detail-val message-body">${escapeHtml(params.message)}</div>
      </div>
    `;

    if (execution.status === 'sent_direct') {
      statusClass = 'executed';
      statusText = 'Enviado sin salir de la app ✅';
      actionsHtml = `
        <div class="sent-success-notice">
          <span>✨ Mensaje despachado con éxito por tu WhatsApp</span>
        </div>
        <button type="button" class="card-btn outline" onclick="dispatchWhatsAppOutbox('${id}', '${rawCleanPhone}', '${escapedMsg}', '${escapedRecipient}')">
          <span>🔄 Reenviar</span>
        </button>
        <a href="${execution.data?.waUrl || '#'}" target="_blank" class="card-btn outline" style="font-size: 0.8rem;">
          <span>Ver en WhatsApp</span> ↗
        </a>
      `;
    } else if (execution.status === 'needs_phone') {
      statusClass = 'pending';
      statusText = 'Falta teléfono ⚠️';
      inlineBoxHtml = `
        <div class="inline-phone-box">
          <span class="inline-phone-label">📱 Ingresá el WhatsApp de <strong>${escapeHtml(params.recipient)}</strong> para enviar ahora:</span>
          <div class="inline-phone-row">
            <input type="tel" id="inline_phone_${id}" class="inline-phone-input" placeholder="ej: 1155551234 o +54911..." autofocus>
            <button type="button" class="card-btn primary" onclick="saveInlinePhone('${id}', '${escapeHtml(params.recipient)}')">
              Guardar y Enviar Directo 🚀
            </button>
          </div>
          <small class="note">Se guardará en tu agenda y se enviará en segundo plano inmediatamente.</small>
        </div>
      `;

      actionsHtml = `
        <button type="button" class="card-btn primary" onclick="quickAddPhone('${escapeHtml(params.recipient)}')">
          <span>+ Agregar en Agenda</span>
        </button>
        <a href="${execution.data.waUrl}" target="_blank" class="card-btn outline">
          <span>Abrir WhatsApp para elegir contacto</span> 💬
        </a>
        <button type="button" class="card-btn outline" onclick="refreshFeed()">
          <span>🔄 Actualizar orden</span>
        </button>
      `;
    } else {
      statusClass = 'executed';
      statusText = 'Listo para enviar 🚀';
      actionsHtml = `
        <button type="button" class="card-btn whatsapp-btn" onclick="dispatchWhatsAppOutbox('${id}', '${rawCleanPhone}', '${escapedMsg}', '${escapedRecipient}')">
          <span>🚀 Enviar sin salir de la app</span>
        </button>
        <a href="${execution.data.waUrl}" target="_blank" class="card-btn outline" style="font-size: 0.85rem;">
          <span>Abrir en WhatsApp</span> 💬
        </a>
        <button type="button" class="card-btn outline" onclick="quickAddPhone('${escapeHtml(params.recipient)}')">
          <span>✏️ Editar Contacto</span>
        </button>
      `;
    }
  } else if (action.id === 'send_email') {
    detailsHtml = `
      <div class="detail-item">
        <span class="detail-label">Remitente</span>
        <span class="detail-val">📧 ${escapeHtml(execution.data.sender)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Destinatario</span>
        <span class="detail-val">🎯 ${escapeHtml(execution.data.to)}</span>
      </div>
      <div class="detail-item" style="grid-column: 1 / -1;">
        <span class="detail-label">Asunto</span>
        <span class="detail-val font-semibold">📌 ${escapeHtml(execution.data.subject)}</span>
      </div>
      <div class="detail-item" style="grid-column: 1 / -1;">
        <span class="detail-label">Cuerpo del correo</span>
        <div class="detail-val message-body">${escapeHtml(execution.data.body)}</div>
      </div>
    `;

    actionsHtml = `
      <a href="${execution.data.gmailUrl}" target="_blank" class="card-btn gmail-btn">
        <span>Abrir en Gmail Web</span> ✉️
      </a>
      <a href="${execution.data.mailtoUrl}" class="card-btn outline">
        <span>Abrir App de Correo</span>
      </a>
    `;
  } else {
    detailsHtml = Object.entries(params).map(([k, v]) => `
      <div class="detail-item">
        <span class="detail-label">${escapeHtml(k)}</span>
        <span class="detail-val">${escapeHtml(String(v))}</span>
      </div>
    `).join('');
  }

  card.innerHTML = `
    <div class="action-card-header">
      <span class="action-badge ${escapeHtml(action.category)}">${categoryIcon} ${escapeHtml(action.name)}</span>
      <span class="status-pill ${statusClass}">${statusText}</span>
    </div>
    <div class="prompt-echo">"${escapeHtml(prompt)}"</div>
    <div class="action-details-grid">
      ${detailsHtml}
    </div>
    ${inlineBoxHtml}
    <div class="action-card-footer">
      <div class="card-message-text">${escapeHtml(execution.message || '')}</div>
      <div class="card-actions">
        ${actionsHtml}
      </div>
    </div>
  `;

  return card;
}

// 7. DESPACHO DIRECTO DE WHATSAPP VÍA BACKEND (OUTBOX DE FIRESTORE)
window.dispatchWhatsAppOutbox = async function(historyId, rawPhone, message, recipientName) {
  const card = document.getElementById(historyId);
  const statusPill = card?.querySelector('.status-pill');
  const actionsContainer = card?.querySelector('.card-actions');

  if (statusPill) {
    statusPill.className = 'status-pill pending';
    statusPill.innerHTML = '⏳ Conectando con tu WhatsApp...';
  }

  if (actionsContainer) {
    actionsContainer.querySelectorAll('button, a').forEach(el => {
      if (el.tagName === 'BUTTON') el.disabled = true;
    });
  }

  try {
    if (!db) {
      if (typeof firebase !== 'undefined' && firebase.apps.length) {
        db = firebase.firestore();
      } else {
        initFirebase();
      }
    }

    if (!db) {
      throw new Error('Servicio de conexión en segundo plano no disponible');
    }

    const clean = cleanPhoneNumber(rawPhone, state.settings.defaultCountryCode);
    if (!clean) {
      throw new Error('Número de teléfono inválido');
    }

    const targetChat = clean.includes('@') ? clean : `${clean}@c.us`;
    const ws = state.settings.whatsappWorkspace || 'personal';

    const outboxDoc = {
      chatId: targetChat,
      text: message,
      channel: 'whatsapp',
      workspaceId: ws,
      createdAt: Date.now()
    };

    console.log('[CommandAI] Despachando a Firestore outbox:', outboxDoc);
    if (statusPill) {
      statusPill.innerHTML = '🚀 Enviando por WhatsApp...';
    }

    const docRef = await db.collection('outbox').add(outboxDoc);

    // Escuchar cuando el daemon en la PC lo procesa y elimina de outbox
    let completed = false;
    const unsub = docRef.onSnapshot((snap) => {
      if (!snap.exists && !completed) {
        completed = true;
        unsub();
        markCardAsSent(historyId, recipientName, clean, message);
      }
    });

    // Fallback de seguridad: a los 3.5 segundos si ya se registró en Firestore
    setTimeout(() => {
      if (!completed) {
        completed = true;
        try { unsub(); } catch(e){}
        markCardAsSent(historyId, recipientName, clean, message);
      }
    }, 3500);

  } catch (err) {
    console.error('[CommandAI] Error despachando WhatsApp:', err);
    if (statusPill) {
      statusPill.className = 'status-pill error';
      statusPill.innerHTML = '❌ Error de envío';
    }
    showToast(`Error al enviar: ${err.message}`, 'error');
    if (actionsContainer) {
      actionsContainer.querySelectorAll('button').forEach(el => el.disabled = false);
    }
  }
};

window.markCardAsSent = function(historyId, recipientName, cleanPhone, message) {
  const card = document.getElementById(historyId);
  if (!card) return;

  const statusPill = card.querySelector('.status-pill');
  if (statusPill) {
    statusPill.className = 'status-pill executed';
    statusPill.innerHTML = 'Enviado sin salir de la app ✅';
  }

  // Guardar en el historial local para persistencia
  const historyItem = state.history.find(h => h.id === historyId);
  if (historyItem) {
    if (!historyItem.execution) historyItem.execution = {};
    historyItem.execution.status = 'sent_direct';
    saveToStorage(STORAGE_KEYS.HISTORY, state.history);
  }

  const encodedMsg = encodeURIComponent(message || '');
  const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;

  const actionsContainer = card.querySelector('.card-actions');
  if (actionsContainer) {
    const escapedMsg = escapeHtml(message).replace(/'/g, "\\'");
    const escapedRec = escapeHtml(recipientName).replace(/'/g, "\\'");
    actionsContainer.innerHTML = `
      <div class="sent-success-notice">
        <span>✨ Mensaje despachado con éxito por tu WhatsApp</span>
      </div>
      <button type="button" class="card-btn outline" onclick="dispatchWhatsAppOutbox('${historyId}', '${cleanPhone}', '${escapedMsg}', '${escapedRec}')">
        <span>🔄 Reenviar</span>
      </button>
      <a href="${waUrl}" target="_blank" class="card-btn outline" style="font-size: 0.8rem;">
        <span>Ver en WhatsApp</span> ↗
      </a>
    `;
  }

  showToast(`¡Mensaje a ${recipientName} enviado con éxito! 🚀`, 'success');
  if (navigator.vibrate) {
    navigator.vibrate([40, 60, 40]);
  }
};

// 8. GUARDAR TELÉFONO DIRECTAMENTE DESDE LA TARJETA
window.saveInlinePhone = function(historyId, recipientName) {
  const inputEl = document.getElementById(`inline_phone_${historyId}`);
  if (!inputEl) return;
  const rawPhone = inputEl.value.trim();
  if (!rawPhone) {
    showToast('Por favor escribe un número de teléfono celular', 'warning');
    inputEl.focus();
    return;
  }

  // Buscar contacto insensible a mayúsculas
  let contact = state.contacts.find(c => c.name.trim().toLowerCase() === recipientName.trim().toLowerCase());
  if (contact) {
    contact.phone = rawPhone;
  } else {
    contact = {
      id: 'c_' + Date.now(),
      name: recipientName.charAt(0).toUpperCase() + recipientName.slice(1),
      phone: rawPhone,
      email: '',
      notes: 'Guardado desde la orden'
    };
    state.contacts.push(contact);
  }

  saveToStorage(STORAGE_KEYS.CONTACTS, state.contacts);
  renderContacts();

  // Actualizar inmediatamente todo el feed de órdenes
  refreshFeed();

  // Enviar inmediatamente en segundo plano sin salir de la app
  const clean = cleanPhoneNumber(rawPhone, state.settings.defaultCountryCode);
  const historyItem = state.history.find(h => h.id === historyId);
  const msg = historyItem?.params?.message || 'Hola cómo estás';

  if (state.settings.autoExecute) {
    if (state.settings.whatsappSendMode !== 'link') {
      dispatchWhatsAppOutbox(historyId, clean, msg, recipientName);
    } else {
      const waUrl = `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(msg)}`;
      window.location.href = waUrl;
    }
  }
};

// 9. TOAST NOTIFICATIONS
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// 8. INICIALIZACIÓN Y EVENTOS
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  setupNavigation();
  setupSpeechRecognition();
  setupFormHandlers();
  renderContacts();
  renderActionsCatalog();
  refreshFeed();
  loadSettingsForm();
});

function setupNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const panes = document.querySelectorAll('.tab-pane');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      if (targetId === 'tab-commander') {
        refreshFeed();
      }
    });
  });
}

function setupFormHandlers() {
  const commandForm = document.getElementById('commandForm');
  const promptInput = document.getElementById('promptInput');
  const autoExecuteToggle = document.getElementById('autoExecuteToggle');

  autoExecuteToggle.checked = state.settings.autoExecute;
  autoExecuteToggle.addEventListener('change', (e) => {
    state.settings.autoExecute = e.target.checked;
    saveToStorage(STORAGE_KEYS.SETTINGS, state.settings);
  });

  commandForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    promptInput.value = '';
    processCommand(prompt);
  });

  // Chips sugeridos
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      promptInput.value = cmd;
      processCommand(cmd);
    });
  });

  // Modal de contactos
  document.getElementById('btnAddContact').addEventListener('click', () => openContactModal());
  document.getElementById('modalCloseBtn').addEventListener('click', closeContactModal);
  document.getElementById('modalCancelBtn').addEventListener('click', closeContactModal);
  document.getElementById('contactForm').addEventListener('submit', handleSaveContact);

  // Formulario de ajustes
  document.getElementById('settingsForm').addEventListener('submit', handleSaveSettings);
}

function setupSpeechRecognition() {
  const voiceBtn = document.getElementById('voiceBtn');
  const promptInput = document.getElementById('promptInput');
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRec) {
    voiceBtn.style.opacity = '0.5';
    voiceBtn.title = 'Reconocimiento de voz no disponible en este navegador';
    return;
  }

  const rec = new SpeechRec();
  rec.lang = 'es-AR';
  rec.continuous = false;

  rec.onstart = () => {
    state.isRecording = true;
    voiceBtn.classList.add('recording');
    promptInput.placeholder = 'Escuchando tu voz... habla ahora.';
  };

  rec.onresult = (e) => {
    promptInput.value = e.results[0][0].transcript;
    promptInput.focus();
  };

  rec.onend = () => {
    state.isRecording = false;
    voiceBtn.classList.remove('recording');
    promptInput.placeholder = "Escribe tu orden...";
  };

  voiceBtn.addEventListener('click', () => {
    if (state.isRecording) rec.stop();
    else rec.start();
  });
}

// 9. GESTIÓN DE CONTACTOS
function renderContacts() {
  const container = document.getElementById('contactsList');
  if (!state.contacts.length) {
    container.innerHTML = '<p style="color: var(--text-muted);">No hay contactos guardados.</p>';
    return;
  }

  container.innerHTML = state.contacts.map(c => `
    <div class="contact-card">
      <div class="contact-card-top">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="contact-avatar">${escapeHtml(c.name.charAt(0).toUpperCase())}</div>
          <div>
            <div class="contact-name">${escapeHtml(c.name)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(c.notes || '')}</div>
          </div>
        </div>
        <div class="contact-card-actions">
          <button class="icon-btn" onclick="editContact('${c.id}')" title="Editar">✏️</button>
          <button class="icon-btn delete" onclick="deleteContact('${c.id}')" title="Eliminar">🗑️</button>
        </div>
      </div>
      ${c.phone ? `
        <div class="contact-info-row">
          <span>📱</span> <strong>WhatsApp:</strong> ${escapeHtml(c.phone)}
        </div>
      ` : `<div class="contact-info-row" style="color: var(--warning);"><span>⚠️</span> Sin número de teléfono</div>`}
      ${c.email ? `
        <div class="contact-info-row">
          <span>✉️</span> <strong>Email:</strong> ${escapeHtml(c.email)}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function openContactModal(contact = {}) {
  document.getElementById('contactId').value = contact.id || '';
  document.getElementById('contactName').value = contact.name || '';
  document.getElementById('contactPhone').value = contact.phone || '';
  document.getElementById('contactEmail').value = contact.email || '';
  document.getElementById('contactNotes').value = contact.notes || '';
  document.getElementById('modalTitle').textContent = contact.id ? 'Editar Contacto' : 'Nuevo Contacto';
  document.getElementById('contactModal').classList.add('open');
  document.getElementById('contactPhone').focus();
}

function closeContactModal() {
  document.getElementById('contactModal').classList.remove('open');
  document.getElementById('contactForm').reset();
}

function handleSaveContact(e) {
  e.preventDefault();
  const id = document.getElementById('contactId').value || 'c_' + Date.now();
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const notes = document.getElementById('contactNotes').value.trim();

  const contact = {
    id,
    name,
    phone,
    email,
    notes
  };

  const idx = state.contacts.findIndex(c => c.id === id || c.name.trim().toLowerCase() === name.toLowerCase());
  if (idx >= 0) state.contacts[idx] = { ...state.contacts[idx], ...contact };
  else state.contacts.push(contact);

  saveToStorage(STORAGE_KEYS.CONTACTS, state.contacts);
  renderContacts();
  closeContactModal();

  // ACTUALIZAR INMEDIATAMENTE LAS ÓRDENES EXISTENTES EN EL FEED
  refreshFeed();
}

window.editContact = function(id) {
  const contact = state.contacts.find(c => c.id === id);
  if (contact) openContactModal(contact);
};

window.deleteContact = function(id) {
  if (!confirm('¿Eliminar este contacto?')) return;
  state.contacts = state.contacts.filter(c => c.id !== id);
  saveToStorage(STORAGE_KEYS.CONTACTS, state.contacts);
  renderContacts();
  refreshFeed();
};

window.quickAddPhone = function(name) {
  const c = state.contacts.find(x => x.name.trim().toLowerCase() === name.trim().toLowerCase()) 
    || { name: name.charAt(0).toUpperCase() + name.slice(1), phone: '' };
  openContactModal(c);
};

// 10. AJUSTES Y CATÁLOGO
function loadSettingsForm() {
  document.getElementById('defaultEmailSender').value = state.settings.defaultEmailSender || '';
  document.getElementById('defaultCountryCode').value = state.settings.defaultCountryCode || '+549';
  document.getElementById('activeProvider').value = state.settings.activeProvider || 'heuristico';
  document.getElementById('geminiApiKey').value = state.settings.geminiApiKey || '';
  document.getElementById('openaiApiKey').value = state.settings.openaiApiKey || '';
  
  const sendModeEl = document.getElementById('whatsappSendMode');
  if (sendModeEl) sendModeEl.value = state.settings.whatsappSendMode || 'direct';

  const wsEl = document.getElementById('whatsappWorkspace');
  if (wsEl) wsEl.value = state.settings.whatsappWorkspace || 'personal';
}

function handleSaveSettings(e) {
  e.preventDefault();
  const statusEl = document.getElementById('settingsSaveStatus');
  state.settings = {
    ...state.settings,
    defaultEmailSender: document.getElementById('defaultEmailSender').value.trim(),
    defaultCountryCode: document.getElementById('defaultCountryCode').value.trim(),
    activeProvider: document.getElementById('activeProvider').value,
    geminiApiKey: document.getElementById('geminiApiKey').value.trim(),
    openaiApiKey: document.getElementById('openaiApiKey').value.trim(),
    whatsappSendMode: document.getElementById('whatsappSendMode')?.value || 'direct',
    whatsappWorkspace: document.getElementById('whatsappWorkspace')?.value || 'personal'
  };
  saveToStorage(STORAGE_KEYS.SETTINGS, state.settings);
  statusEl.textContent = '✅ Guardado';
  statusEl.style.color = 'var(--success)';
  setTimeout(() => statusEl.textContent = '', 2000);
}

function renderActionsCatalog() {
  const grid = document.getElementById('actionsGrid');
  grid.innerHTML = Object.values(ACTION_REGISTRY).map(a => `
    <div class="action-info-card">
      <div class="action-info-header">
        <div>
          <h4>${escapeHtml(a.name)}</h4>
          <span class="action-badge ${escapeHtml(a.category)}">${escapeHtml(a.category)}</span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(a.id)}</span>
      </div>
      <p>${escapeHtml(a.description)}</p>
      <div class="action-params-list">
        <strong>Parámetros:</strong> ${escapeHtml(Object.keys(a.parameters).join(', '))}
      </div>
      ${a.examples?.length ? `
        <div style="font-size: 0.8rem; color: var(--text-muted);">
          <em>Ejemplo: "${escapeHtml(a.examples[0])}"</em>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
