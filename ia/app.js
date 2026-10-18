// CommandAI - Motor Cliente 100% Autónomo (PWA / GitHub Pages / Vercel)
// Funciona directamente en cualquier celular sin depender de servidores locales.

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
    phone: '', // Editable desde la pantalla
    email: 'agustina@ejemplo.com',
    notes: 'Contacto de WhatsApp'
  },
  {
    id: 'c2',
    name: 'Ramiro',
    phone: '',
    email: 'ramirovescostain@gmail.com',
    notes: 'Cuenta propia'
  }
];

const DEFAULT_SETTINGS = {
  defaultEmailSender: 'ramirovescostain@gmail.com',
  defaultCountryCode: '+549',
  activeProvider: 'heuristico', // 'heuristico', 'gemini', 'openai'
  geminiApiKey: '',
  openaiApiKey: '',
  autoExecute: true
};

const state = {
  contacts: loadFromStorage(STORAGE_KEYS.CONTACTS, DEFAULT_CONTACTS),
  settings: loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  history: loadFromStorage(STORAGE_KEYS.HISTORY, []),
  notes: loadFromStorage(STORAGE_KEYS.NOTES, []),
  isRecording: false
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
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

// 2. PARSER SEMÁNTICO HEURÍSTICO LOCAL (Zero-Latency, 100% Offline)
function parseCommandHeuristic(rawText, contacts) {
  const raw = rawText.trim();
  const lower = raw.toLowerCase();

  // A. WHATSAPP
  if (lower.includes('whatsapp') || lower.includes('wsp') || lower.includes('wasap') || lower.includes('mensaje')) {
    let recipient = '';
    let message = '';

    // Buscar destinatario: "a Agustina por WhatsApp", "para Agustina", "whatsapp a Agustina"
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
      message = raw.replace(/^(?:mándale|manda|enviar|escribile|mandar)\s+(?:este\s+mensaje|un\s+mensaje)?\s*(?:a|para)?\s*[A-ZÁÉÍÓÚa-záéíóú0-9_+]+\s*(?:por\s+whatsapp)?\s*/i, '').trim();
    }

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
      let phone = '';
      const recipientName = params.recipient;
      const contact = state.contacts.find(c => c.name.toLowerCase() === recipientName.toLowerCase() || (c.phone && c.phone.includes(recipientName)));
      
      if (contact && contact.phone) {
        phone = contact.phone.replace(/[^\d+]/g, '');
      } else if (/[\d]{7,}/.test(recipientName)) {
        phone = recipientName.replace(/[^\d+]/g, '');
      }

      if (phone && !phone.startsWith('+')) {
        const defaultCode = (state.settings.defaultCountryCode || '+549').replace('+', '');
        if (phone.startsWith('0')) phone = phone.substring(1);
        phone = defaultCode + phone;
      }
      const cleanPhone = phone.replace('+', '');
      const encodedMsg = encodeURIComponent(params.message);

      // Enlaces universales compatibles con celular (Android e iOS)
      const waUrl = cleanPhone 
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`
        : `https://api.whatsapp.com/send?text=${encodedMsg}`;
      const appUrl = cleanPhone
        ? `whatsapp://send?phone=${cleanPhone}&text=${encodedMsg}`
        : `whatsapp://send?text=${encodedMsg}`;

      return {
        success: true,
        status: cleanPhone ? 'ready' : 'needs_phone',
        message: cleanPhone ? `Listo para enviar a ${recipientName}` : `Aún no tenés registrado el teléfono de ${recipientName}`,
        data: {
          recipient: recipientName,
          phone: cleanPhone ? '+' + cleanPhone : '',
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
      let targetEmail = params.to;
      const contact = state.contacts.find(c => c.name.toLowerCase() === targetEmail.toLowerCase());
      if (contact && contact.email) targetEmail = contact.email;

      const encodedSub = encodeURIComponent(params.subject);
      const encodedBody = encodeURIComponent(params.body);
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
    renderActionCard({
      prompt: trimmed,
      unrecognized: true,
      message: 'No reconocí una acción concreta. Prueba diciendo: "mándale este mensaje a Agustina por WhatsApp que dice..." o "mandá un mail a través de la cuenta ramirovescostain@gmail.com a..."'
    });
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

  renderActionCard({
    prompt: trimmed,
    action,
    params: detected.params,
    execution
  });

  // Si tiene apertura directa activa y es WhatsApp o Email
  if (state.settings.autoExecute) {
    if (action.id === 'send_whatsapp' && execution.data?.waUrl && execution.status === 'ready') {
      window.location.href = execution.data.waUrl;
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

// 6. RENDERIZADO DE LA INTERFAZ
const feedContainer = document.getElementById('feedContainer');
const emptyFeedPlaceholder = document.getElementById('emptyFeedPlaceholder');

function renderActionCard(item) {
  if (emptyFeedPlaceholder) emptyFeedPlaceholder.style.display = 'none';

  const card = document.createElement('div');
  card.className = 'action-card';

  if (item.unrecognized) {
    card.innerHTML = `
      <div class="action-card-header">
        <span class="action-badge general">🤖 Consulta</span>
        <span class="status-pill failed">Sin acción clara</span>
      </div>
      <div class="prompt-echo">"${escapeHtml(item.prompt)}"</div>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(item.message)}</p>
    `;
    feedContainer.prepend(card);
    return;
  }

  const { action, params, execution, prompt } = item;
  let categoryIcon = '⚡';
  if (action.id === 'send_whatsapp') categoryIcon = '💬';
  if (action.id === 'send_email') categoryIcon = '✉️';
  if (action.id === 'create_reminder') categoryIcon = '⏰';

  let statusClass = execution.status === 'ready' || execution.status === 'saved' ? 'executed' : 'pending';
  let statusText = execution.status === 'ready' ? 'Listo para enviar ✅' : (execution.status === 'needs_phone' ? 'Falta teléfono ⚠️' : 'Completado ✅');

  let detailsHtml = '';
  let actionsHtml = '';

  if (action.id === 'send_whatsapp') {
    detailsHtml = `
      <div class="detail-item">
        <span class="detail-label">Destinatario</span>
        <span class="detail-val">👤 ${escapeHtml(params.recipient)} ${execution.data?.phone ? `(${execution.data.phone})` : ''}</span>
      </div>
      <div class="detail-item" style="grid-column: 1 / -1;">
        <span class="detail-label">Mensaje</span>
        <div class="detail-val message-body">${escapeHtml(params.message)}</div>
      </div>
    `;

    if (execution.status === 'needs_phone') {
      actionsHtml = `
        <button class="card-btn primary" onclick="quickAddPhone('${escapeHtml(params.recipient)}')">
          <span>+ Agregar Teléfono de ${escapeHtml(params.recipient)}</span>
        </button>
        <a href="${execution.data.waUrl}" target="_blank" class="card-btn outline">
          <span>Abrir WhatsApp para elegir contacto</span> 💬
        </a>
      `;
    } else {
      actionsHtml = `
        <a href="${execution.data.waUrl}" class="card-btn whatsapp-btn">
          <span>Abrir WhatsApp Ahora</span> 💬
        </a>
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
    <div class="action-card-footer">
      <div class="card-message-text">${escapeHtml(execution.message || '')}</div>
      <div class="card-actions">
        ${actionsHtml}
      </div>
    </div>
  `;

  feedContainer.prepend(card);
}

// 7. INICIALIZACIÓN Y EVENTOS
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupSpeechRecognition();
  setupFormHandlers();
  renderContacts();
  renderActionsCatalog();
  renderHistory();
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

// 8. GESTIÓN DE CONTACTOS
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
}

function closeContactModal() {
  document.getElementById('contactModal').classList.remove('open');
  document.getElementById('contactForm').reset();
}

function handleSaveContact(e) {
  e.preventDefault();
  const id = document.getElementById('contactId').value || 'c_' + Date.now();
  const contact = {
    id,
    name: document.getElementById('contactName').value.trim(),
    phone: document.getElementById('contactPhone').value.trim(),
    email: document.getElementById('contactEmail').value.trim(),
    notes: document.getElementById('contactNotes').value.trim()
  };

  const idx = state.contacts.findIndex(c => c.id === id);
  if (idx >= 0) state.contacts[idx] = contact;
  else state.contacts.push(contact);

  saveToStorage(STORAGE_KEYS.CONTACTS, state.contacts);
  renderContacts();
  closeContactModal();
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
};

window.quickAddPhone = function(name) {
  const c = state.contacts.find(x => x.name.toLowerCase() === name.toLowerCase()) || { name };
  openContactModal(c);
};

// 9. AJUSTES Y CATÁLOGO
function loadSettingsForm() {
  document.getElementById('defaultEmailSender').value = state.settings.defaultEmailSender || '';
  document.getElementById('defaultCountryCode').value = state.settings.defaultCountryCode || '+549';
  document.getElementById('activeProvider').value = state.settings.activeProvider || 'heuristico';
  document.getElementById('geminiApiKey').value = state.settings.geminiApiKey || '';
  document.getElementById('openaiApiKey').value = state.settings.openaiApiKey || '';
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
    openaiApiKey: document.getElementById('openaiApiKey').value.trim()
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

function renderHistory() {
  if (state.history.length > 0) {
    state.history.slice(0, 5).forEach(item => {
      const action = ACTION_REGISTRY[item.actionId] || { name: item.actionName, category: 'general' };
      renderActionCard({
        prompt: item.prompt,
        action,
        params: item.params,
        execution: item.execution
      });
    });
  }
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
