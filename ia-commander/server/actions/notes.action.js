import { BaseAction } from '../registry/BaseAction.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTES_FILE = path.join(__dirname, '../storage/notes.json');

function getNotes() {
  if (!fs.existsSync(NOTES_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8');
}

export default class NotesAction extends BaseAction {
  constructor() {
    super({
      id: 'save_note',
      name: 'Guardar nota rápida',
      category: 'productividad',
      description: 'Guarda una nota, apunte o idea en la libreta personal.',
      parameters: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            description: 'El contenido o texto que se desea anotar.'
          },
          category: {
            type: 'string',
            description: 'Etiqueta o categoría opcional (ej: "trabajo", "ideas", "personal").'
          }
        },
        required: ['content']
      },
      examples: [
        'anota que la clave del portón es 4455',
        'guardar nota sobre reunión con el equipo el martes'
      ]
    });
  }

  async execute(params, context) {
    const { content, category = 'general' } = params;
    const notes = getNotes();

    const note = {
      id: 'n_' + Date.now(),
      content,
      category,
      createdAt: new Date().toISOString()
    };

    notes.unshift(note);
    saveNotes(notes);

    return {
      success: true,
      status: 'saved',
      message: `Nota guardada exitosamente: "${content.length > 40 ? content.substring(0, 40) + '...' : content}"`,
      data: note
    };
  }
}
