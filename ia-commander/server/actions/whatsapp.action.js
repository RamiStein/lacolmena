import { BaseAction } from '../registry/BaseAction.js';
import { exec } from 'child_process';

function cleanPhoneNumber(phone, defaultCountry = '+549') {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    cleaned = defaultCountry + cleaned;
  }
  return cleaned.replace('+', '');
}

export default class WhatsAppAction extends BaseAction {
  constructor() {
    super({
      id: 'send_whatsapp',
      name: 'Enviar mensaje de WhatsApp',
      category: 'mensajeria',
      description: 'Envía un mensaje de texto por WhatsApp a un contacto (como Agustina) o a un número telefónico.',
      parameters: {
        type: 'object',
        properties: {
          recipient: {
            type: 'string',
            description: 'Nombre del contacto (ej: "Agustina", "Mamá") o número telefónico con código de país.'
          },
          message: {
            type: 'string',
            description: 'El texto exacto del mensaje que se va a enviar.'
          },
          openDirectly: {
            type: 'boolean',
            description: 'Si es true, abre automáticamente WhatsApp en la computadora (escritorio o web).'
          }
        },
        required: ['recipient', 'message']
      },
      examples: [
        'mándale este mensaje a Agustina por WhatsApp que dice Hola cómo estás',
        'enviar WhatsApp a +5491155551234 diciendo nos vemos a las 5',
        'escribile a Juan por WhatsApp que ya llegué'
      ]
    });
  }

  async execute(params, context) {
    const { recipient, message, openDirectly = true } = params;
    const db = context.db;
    const settings = db ? db.getSettings() : { defaultCountryCode: '+549' };

    let phone = '';
    let contactName = recipient;
    let contactObj = null;

    // Buscar si es un contacto registrado
    if (db) {
      contactObj = db.findContact(recipient);
      if (contactObj && contactObj.phone) {
        phone = contactObj.phone;
        contactName = contactObj.name;
      }
    }

    // Si no se encontró en contactos, chequear si el recipient ya parece un teléfono
    if (!phone && /[\d]{7,}/.test(recipient)) {
      phone = recipient;
    }

    const formattedPhone = cleanPhoneNumber(phone, settings.defaultCountryCode);
    const encodedText = encodeURIComponent(message);
    const webUrl = formattedPhone 
      ? `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`
      : `https://web.whatsapp.com/send?text=${encodedText}`;
    const appUrl = formattedPhone
      ? `whatsapp://send?phone=${formattedPhone}&text=${encodedText}`
      : `whatsapp://send?text=${encodedText}`;

    let launched = false;
    let launchError = null;

    // Si se especificó abrir directamente en Windows
    if (openDirectly && formattedPhone) {
      try {
        // En Windows, intentamos abrir la app de WhatsApp o en su defecto WhatsApp Web
        exec(`start "" "${webUrl}"`, (err) => {
          if (err) console.error('[WhatsAppAction] Error abriendo URL:', err);
        });
        launched = true;
      } catch (err) {
        launchError = err.message;
      }
    }

    if (!phone) {
      return {
        success: false,
        status: 'needs_phone',
        message: `Se preparó el mensaje para "${recipient}", pero aún no tenemos registrado su número de teléfono.`,
        data: {
          recipient,
          message,
          webUrl,
          appUrl,
          suggestSaveContact: true
        }
      };
    }

    return {
      success: true,
      status: 'sent_or_opened',
      message: `Mensaje de WhatsApp para ${contactName} listo y lanzado con éxito.`,
      data: {
        recipient: contactName,
        phone,
        formattedPhone,
        message,
        webUrl,
        appUrl,
        opened: launched,
        launchError
      }
    };
  }
}
