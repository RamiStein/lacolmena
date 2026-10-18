import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTACTS_FILE = path.join(__dirname, 'contacts.json');
const HISTORY_FILE = path.join(__dirname, 'history.json');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

const DEFAULT_CONTACTS = [
  {
    id: 'c1',
    name: 'Agustina',
    phone: '+5491100000000', // Teléfono editable desde la interfaz
    email: 'agustina@ejemplo.com',
    notes: 'Contacto principal de WhatsApp'
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
  smtpHost: 'smtp.gmail.com',
  smtpPort: 465,
  smtpSecure: true,
  smtpUser: 'ramirovescostain@gmail.com',
  smtpPass: '', // Contraseña de aplicación de Google (16 letras)
  geminiApiKey: '',
  openaiApiKey: '',
  autoExecute: false, // Por defecto pide confirmación visual para seguridad
  defaultCountryCode: '+549',
  activeProvider: 'auto' // 'auto' (usa API key si hay, sino fallback inteligente)
};

function readJsonFile(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error leyendo ${filePath}:`, err);
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error guardando ${filePath}:`, err);
    return false;
  }
}

export const db = {
  // Contactos
  getContacts() {
    return readJsonFile(CONTACTS_FILE, DEFAULT_CONTACTS);
  },
  saveContact(contact) {
    const contacts = this.getContacts();
    const existingIndex = contacts.findIndex(c => c.id === contact.id || c.name.toLowerCase() === contact.name.toLowerCase());
    if (existingIndex >= 0) {
      contacts[existingIndex] = { ...contacts[existingIndex], ...contact };
    } else {
      contact.id = contact.id || 'c_' + Date.now();
      contacts.push(contact);
    }
    writeJsonFile(CONTACTS_FILE, contacts);
    return contact;
  },
  deleteContact(id) {
    let contacts = this.getContacts();
    contacts = contacts.filter(c => c.id !== id);
    writeJsonFile(CONTACTS_FILE, contacts);
    return true;
  },
  findContact(query) {
    if (!query) return null;
    const q = query.trim().toLowerCase();
    const contacts = this.getContacts();
    return contacts.find(c => 
      c.name.toLowerCase() === q ||
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase() === q)
    ) || null;
  },

  // Historial de comandos ejecutados
  getHistory() {
    return readJsonFile(HISTORY_FILE, []);
  },
  addHistoryItem(item) {
    const history = this.getHistory();
    const entry = {
      id: 'h_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      ...item
    };
    history.unshift(entry);
    // Conservar últimos 100 comandos
    if (history.length > 100) history.pop();
    writeJsonFile(HISTORY_FILE, history);
    return entry;
  },
  clearHistory() {
    writeJsonFile(HISTORY_FILE, []);
    return true;
  },

  // Ajustes
  getSettings() {
    return { ...DEFAULT_SETTINGS, ...readJsonFile(SETTINGS_FILE, DEFAULT_SETTINGS) };
  },
  updateSettings(updates) {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    writeJsonFile(SETTINGS_FILE, updated);
    return updated;
  }
};
