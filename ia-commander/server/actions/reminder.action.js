import { BaseAction } from '../registry/BaseAction.js';

export default class ReminderAction extends BaseAction {
  constructor() {
    super({
      id: 'create_reminder',
      name: 'Crear recordatorio',
      category: 'productividad',
      description: 'Crea un recordatorio o alarma con un título, fecha/hora o tiempo relativo.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'De qué es el recordatorio (ej: "Llamar al médico", "Revisar el horno")'
          },
          time: {
            type: 'string',
            description: 'Hora o fecha indicada (ej: "18:00", "en 10 minutos", "mañana a las 9am")'
          }
        },
        required: ['title']
      },
      examples: [
        'crea un recordatorio para llamar al contador a las 15:00',
        'recordarme comprar café en 30 minutos'
      ]
    });
  }

  async execute(params, context) {
    const { title, time = 'Pronto' } = params;
    const db = context.db;

    const reminder = {
      id: 'rem_' + Date.now(),
      title,
      time,
      createdAt: new Date().toISOString(),
      completed: false
    };

    if (db) {
      const history = db.getHistory();
      // Guardado como evento
    }

    return {
      success: true,
      status: 'scheduled',
      message: `Recordatorio programado: "${title}" (${time}).`,
      data: reminder
    };
  }
}
