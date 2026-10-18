// Estado global de la aplicación
const state = {
  contacts: [],
  actions: [],
  settings: {},
  history: [],
  autoExecute: true,
  isRecording: false
};

// Elementos DOM
const feedContainer = document.getElementById('feedContainer');
const emptyFeedPlaceholder = document.getElementById('emptyFeedPlaceholder');
const commandForm = document.getElementById('commandForm');
const promptInput = document.getElementById('promptInput');
const submitBtn = document.getElementById('submitBtn');
const voiceBtn = document.getElementById('voiceBtn');
const autoExecuteToggle = document.getElementById('autoExecuteToggle');
const activeEngineText = document.getElementById('activeEngineText');

// Modales y formularios
const contactModal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const btnAddContact = document.getElementById('btnAddContact');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const settingsForm = document.getElementById('settingsForm');

// 1. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupSpeechRecognition();
  setupEventHandlers();

  await Promise.all([
    loadSettings(),
    loadContacts(),
    loadActions(),
    loadHistory()
  ]);
});

// Navegación de pestañas
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

// Configurar reconocimiento por voz (Speech-to-Text)
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.title = 'Reconocimiento de voz no soportado en este navegador';
    voiceBtn.style.opacity = '0.5';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-AR';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    state.isRecording = true;
    voiceBtn.classList.add('recording');
    promptInput.placeholder = 'Escuchando tu voz... habla ahora.';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    promptInput.value = transcript;
    promptInput.focus();
  };

  recognition.onerror = (event) => {
    console.error('Error de voz:', event.error);
    stopVoice();
  };

  recognition.onend = () => {
    stopVoice();
  };

  function stopVoice() {
    state.isRecording = false;
    voiceBtn.classList.remove('recording');
    promptInput.placeholder = "Escribe tu orden (ej: 'mándale este mensaje a Agustina por WhatsApp')...";
  }

  voiceBtn.addEventListener('click', () => {
    if (state.isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  });
}

// Event Listeners principales
function setupEventHandlers() {
  // Ajuste automático de altura del textarea
  promptInput.addEventListener('input', () => {
    promptInput.style.height = 'auto';
    promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + 'px';
  });

  // Enviar con Enter (y Shift+Enter para salto de línea)
  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commandForm.requestSubmit();
    }
  });

  // Envío del formulario de comando
  commandForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    promptInput.value = '';
    promptInput.style.height = 'auto';
    await executeCommand(prompt);
  });

  // Toggle de ejecución automática
  autoExecuteToggle.addEventListener('change', (e) => {
    state.autoExecute = e.target.checked;
  });

  // Chips de sugerencia
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      promptInput.value = cmd;
      promptInput.focus();
      executeCommand(cmd);
    });
  });

  // Modal de contactos
  btnAddContact.addEventListener('click', () => openContactModal());
  modalCloseBtn.addEventListener('click', () => closeContactModal());
  modalCancelBtn.addEventListener('click', () => closeContactModal());
  contactForm.addEventListener('submit', handleSaveContact);

  // Guardar configuración
  settingsForm.addEventListener('submit', handleSaveSettings);
}

// 2. EJECUTAR COMANDO
async function executeCommand(prompt) {
  if (emptyFeedPlaceholder) {
    emptyFeedPlaceholder.style.display = 'none';
  }

  // Tarjeta de carga preliminar
  const tempCard = document.createElement('div');
  tempCard.className = 'action-card';
  tempCard.innerHTML = `
    <div class="prompt-echo">"${escapeHtml(prompt)}"</div>
    <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 0.9rem;">
      <span style="animation: spin 1s linear infinite; display: inline-block;">⏳</span> Procesando orden e interpretando acción...
    </div>
  `;
  feedContainer.appendChild(tempCard);
  feedContainer.scrollTop = feedContainer.scrollHeight;

  try {
    const res = await fetch('/api/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        autoExecute: state.autoExecute
      })
    });

    const data = await res.json();
    tempCard.remove();

    renderActionCard(data);
  } catch (err) {
    console.error('Error ejecutando comando:', err);
    tempCard.innerHTML = `
      <div class="prompt-echo">"${escapeHtml(prompt)}"</div>
      <div style="color: var(--danger); font-size: 0.9rem;">
        ❌ Error de conexión al servidor: ${escapeHtml(err.message)}
      </div>
    `;
  }
}

// RENDERIZAR TARJETA DE ACCIÓN
function renderActionCard(data) {
  const card = document.createElement('div');
  card.className = 'action-card';

  if (!data.success && data.status === 'unrecognized') {
    card.innerHTML = `
      <div class="action-card-header">
        <span class="action-badge general">🤖 Consulta</span>
        <span class="status-pill failed">Sin acción clara</span>
      </div>
      <div class="prompt-echo">"${escapeHtml(data.prompt)}"</div>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(data.message)}</p>
    `;
    feedContainer.appendChild(card);
    feedContainer.scrollTop = feedContainer.scrollHeight;
    return;
  }

  const action = data.action || {};
  const params = data.params || {};
  const exec = data.execution || {};
  const category = action.category || 'general';

  // Header
  let categoryIcon = '⚡';
  if (category === 'mensajeria' || action.id === 'send_whatsapp') categoryIcon = '💬';
  if (category === 'correo' || action.id === 'send_email') categoryIcon = '✉️';
  if (category === 'productividad') categoryIcon = '⏰';

  let statusClass = 'pending';
  let statusText = 'Esperando confirmación';
  if (data.status === 'executed' || exec.status === 'sent_smtp' || exec.status === 'sent_or_opened') {
    statusClass = 'executed';
    statusText = 'Ejecutado con éxito ✅';
  } else if (exec.status === 'opened_in_browser') {
    statusClass = 'executed';
    statusText = 'Borrador abierto en pantalla 📨';
  } else if (exec.status === 'needs_phone') {
    statusClass = 'pending';
    statusText = 'Falta número de teléfono ⚠️';
  } else if (data.status === 'error' || data.status === 'failed') {
    statusClass = 'failed';
    statusText = 'Error en ejecución ❌';
  }

  // Detalles de los parámetros según la acción
  let detailsHtml = '';
  let actionsHtml = '';

  if (action.id === 'send_whatsapp') {
    detailsHtml = `
      <div class="detail-item">
        <span class="detail-label">Destinatario</span>
        <span class="detail-val">👤 ${escapeHtml(params.recipient)} ${exec.data?.phone ? `(${exec.data.phone})` : ''}</span>
      </div>
      <div class="detail-item" style="grid-column: 1 / -1;">
        <span class="detail-label">Mensaje</span>
        <div class="detail-val message-body">${escapeHtml(params.message)}</div>
      </div>
    `;

    const webUrl = exec.data?.webUrl || `https://web.whatsapp.com/send?text=${encodeURIComponent(params.message)}`;
    const appUrl = exec.data?.appUrl || `whatsapp://send?text=${encodeURIComponent(params.message)}`;

    actionsHtml = `
      <a href="${webUrl}" target="_blank" class="card-btn whatsapp-btn">
        <span>Abrir WhatsApp Web</span> 💬
      </a>
      <a href="${appUrl}" class="card-btn outline">
        <span>Abrir App de Escritorio</span>
      </a>
    `;

    if (exec.status === 'needs_phone') {
      actionsHtml += `
        <button class="card-btn primary" onclick="quickAddPhone('${escapeHtml(params.recipient)}')">
          <span>+ Agregar Teléfono de ${escapeHtml(params.recipient)}</span>
        </button>
      `;
    }
  } else if (action.id === 'send_email') {
    detailsHtml = `
      <div class="detail-item">
        <span class="detail-label">Remitente</span>
        <span class="detail-val">📧 ${escapeHtml(params.senderAccount || 'ramirovescostain@gmail.com')}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Destinatario</span>
        <span class="detail-val">🎯 ${escapeHtml(params.to)}</span>
      </div>
      <div class="detail-item" style="grid-column: 1 / -1;">
        <span class="detail-label">Asunto</span>
        <span class="detail-val font-semibold">📌 ${escapeHtml(params.subject)}</span>
      </div>
      <div class="detail-item" style="grid-column: 1 / -1;">
        <span class="detail-label">Cuerpo del correo</span>
        <div class="detail-val message-body">${escapeHtml(params.body)}</div>
      </div>
    `;

    const gmailWebUrl = exec.data?.gmailWebUrl || `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(params.to)}&su=${encodeURIComponent(params.subject)}&body=${encodeURIComponent(params.body)}`;

    actionsHtml = `
      <a href="${gmailWebUrl}" target="_blank" class="card-btn gmail-btn">
        <span>Abrir en Gmail Web</span> ✉️
      </a>
      <button class="card-btn outline" onclick="confirmExecuteAction('${action.id}', ${escapeHtml(JSON.stringify(params))})">
        <span>Re-intentar Envío</span>
      </button>
    `;
  } else {
    // Parámetros genéricos
    detailsHtml = Object.entries(params).map(([k, v]) => `
      <div class="detail-item">
        <span class="detail-label">${escapeHtml(k)}</span>
        <span class="detail-val">${escapeHtml(String(v))}</span>
      </div>
    `).join('');

    actionsHtml = `
      <button class="card-btn primary" onclick="confirmExecuteAction('${action.id}', ${escapeHtml(JSON.stringify(params))})">
        <span>Ejecutar de nuevo</span>
      </button>
    `;
  }

  card.innerHTML = `
    <div class="action-card-header">
      <span class="action-badge ${category}">
        ${categoryIcon} ${escapeHtml(action.name || action.id)}
      </span>
      <span class="status-pill ${statusClass}">${statusText}</span>
    </div>

    <div class="prompt-echo">"${escapeHtml(data.prompt)}"</div>

    <div class="action-details-grid">
      ${detailsHtml}
    </div>

    <div class="action-card-footer">
      <div class="card-message-text">
        ${exec.message ? `ℹ️ ${escapeHtml(exec.message)}` : ''}
      </div>
      <div class="card-actions">
        ${actionsHtml}
      </div>
    </div>
  `;

  feedContainer.appendChild(card);
  feedContainer.scrollTop = feedContainer.scrollHeight;
}

// Confirmar ejecución de acción manual
window.confirmExecuteAction = async function(actionId, params) {
  try {
    const res = await fetch('/api/command/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionId, params })
    });
    const result = await res.json();
    alert(result.message || 'Acción ejecutada');
  } catch (err) {
    alert('Error ejecutando: ' + err.message);
  }
};

window.quickAddPhone = function(contactName) {
  openContactModal({ name: contactName });
};

// 3. CARGA DE DATOS (SETTINGS, ACTIONS, CONTACTS, HISTORY)
async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    state.settings = data;

    document.getElementById('defaultEmailSender').value = data.defaultEmailSender || 'ramirovescostain@gmail.com';
    document.getElementById('defaultCountryCode').value = data.defaultCountryCode || '+549';
    document.getElementById('activeProvider').value = data.activeProvider || 'auto';
    if (data.geminiApiKey) document.getElementById('geminiApiKey').value = data.geminiApiKey;
    if (data.openaiApiKey) document.getElementById('openaiApiKey').value = data.openaiApiKey;
    if (data.hasSmtpPass) document.getElementById('smtpPass').value = '••••••••••••';

    // Actualizar texto en barra lateral
    if (data.activeProvider === 'gemini' && data.geminiApiKey) {
      activeEngineText.textContent = 'Google Gemini 1.5 Flash';
    } else if (data.activeProvider === 'openai' && data.openaiApiKey) {
      activeEngineText.textContent = 'OpenAI GPT-4o';
    } else {
      activeEngineText.textContent = 'Heurístico Local (Rápido)';
    }
  } catch (err) {
    console.error('Error cargando ajustes:', err);
  }
}

async function handleSaveSettings(e) {
  e.preventDefault();
  const statusEl = document.getElementById('settingsSaveStatus');
  statusEl.textContent = 'Guardando...';
  statusEl.style.color = 'var(--warning)';

  const updates = {
    defaultEmailSender: document.getElementById('defaultEmailSender').value.trim(),
    defaultCountryCode: document.getElementById('defaultCountryCode').value.trim(),
    activeProvider: document.getElementById('activeProvider').value,
    geminiApiKey: document.getElementById('geminiApiKey').value.trim(),
    openaiApiKey: document.getElementById('openaiApiKey').value.trim(),
    smtpPass: document.getElementById('smtpPass').value.trim()
  };

  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data.success) {
      statusEl.textContent = '✅ Guardado correctamente';
      statusEl.style.color = 'var(--success)';
      setTimeout(() => statusEl.textContent = '', 3000);
      loadSettings();
    }
  } catch (err) {
    statusEl.textContent = '❌ Error al guardar';
    statusEl.style.color = 'var(--danger)';
  }
}

async function loadActions() {
  try {
    const res = await fetch('/api/actions');
    const actions = await res.json();
    state.actions = actions;

    const grid = document.getElementById('actionsGrid');
    grid.innerHTML = actions.map(a => `
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
          <strong>Parámetros:</strong> ${escapeHtml(Object.keys(a.parameters?.properties || {}).join(', '))}
        </div>
        ${a.examples?.length ? `
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            <em>Ejemplo: "${escapeHtml(a.examples[0])}"</em>
          </div>
        ` : ''}
      </div>
    `).join('');
  } catch (err) {
    console.error('Error cargando acciones:', err);
  }
}

async function loadContacts() {
  try {
    const res = await fetch('/api/contacts');
    const contacts = await res.json();
    state.contacts = contacts;

    const container = document.getElementById('contactsList');
    if (!contacts.length) {
      container.innerHTML = '<p style="color: var(--text-muted);">No hay contactos registrados todavía.</p>';
      return;
    }

    container.innerHTML = contacts.map(c => `
      <div class="contact-card">
        <div class="contact-card-top">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="contact-avatar">${escapeHtml(c.name.charAt(0).toUpperCase())}</div>
            <div>
              <div class="contact-name">${escapeHtml(c.name)}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(c.notes || 'Sin notas')}</div>
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
        ` : '<div class="contact-info-row" style="color: var(--warning);"><span>⚠️</span> Sin número de teléfono</div>'}
        ${c.email ? `
          <div class="contact-info-row">
            <span>✉️</span> <strong>Email:</strong> ${escapeHtml(c.email)}
          </div>
        ` : ''}
      </div>
    `).join('');
  } catch (err) {
    console.error('Error cargando contactos:', err);
  }
}

async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    const history = await res.json();
    state.history = history;

    if (history.length > 0 && emptyFeedPlaceholder) {
      emptyFeedPlaceholder.style.display = 'none';
      // Cargar los últimos 5 del historial de forma invertida
      history.slice(0, 5).reverse().forEach(item => {
        renderActionCard({
          success: item.status !== 'failed' && item.status !== 'error',
          status: item.status,
          prompt: item.prompt,
          action: { id: item.actionId, name: item.actionName },
          params: item.params,
          execution: item.executionResult || {}
        });
      });
    }
  } catch (err) {
    console.error('Error cargando historial:', err);
  }
}

// Contact Modal Functions
function openContactModal(contact = {}) {
  document.getElementById('contactId').value = contact.id || '';
  document.getElementById('contactName').value = contact.name || '';
  document.getElementById('contactPhone').value = contact.phone || '';
  document.getElementById('contactEmail').value = contact.email || '';
  document.getElementById('contactNotes').value = contact.notes || '';
  document.getElementById('modalTitle').textContent = contact.id ? 'Editar Contacto' : 'Nuevo Contacto';
  contactModal.classList.add('open');
  document.getElementById('contactName').focus();
}

function closeContactModal() {
  contactModal.classList.remove('open');
  contactForm.reset();
}

async function handleSaveContact(e) {
  e.preventDefault();
  const contact = {
    id: document.getElementById('contactId').value,
    name: document.getElementById('contactName').value.trim(),
    phone: document.getElementById('contactPhone').value.trim(),
    email: document.getElementById('contactEmail').value.trim(),
    notes: document.getElementById('contactNotes').value.trim()
  };

  try {
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    closeContactModal();
    await loadContacts();
  } catch (err) {
    alert('Error al guardar contacto: ' + err.message);
  }
}

window.editContact = function(id) {
  const contact = state.contacts.find(c => c.id === id);
  if (contact) openContactModal(contact);
};

window.deleteContact = async function(id) {
  if (!confirm('¿Seguro que deseas eliminar este contacto?')) return;
  try {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    await loadContacts();
  } catch (err) {
    alert('Error eliminando contacto: ' + err.message);
  }
};

// Utilidad para sanitizar texto
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
