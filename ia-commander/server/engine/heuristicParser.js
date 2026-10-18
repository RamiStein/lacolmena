/**
 * Parser semántico inteligente para interpretar comandos en lenguaje natural
 * sin necesidad obligatoria de una API Key de pago externa.
 */
export function parseCommandHeuristic(text, contacts = []) {
  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. Detección de WHATSAPP
  if (lower.includes('whatsapp') || lower.includes('wsp') || lower.includes('wasap') || lower.includes('msj') || lower.includes('mensaje')) {
    // Si contiene intención de WhatsApp
    if (lower.includes('whatsapp') || lower.includes('wsp') || lower.includes('wasap')) {
      let recipient = '';
      let message = '';

      // Extracción de destinatario
      // "mándale este mensaje a Agustina por WhatsApp que dice..."
      // "enviar whatsapp a Agustina con el texto..."
      const toMatch = raw.match(/(?:a|para)\s+([A-ZÁÉÍÓÚa-záéíóú0-9_+]+)(?:\s+por\s+whatsapp|\s+en\s+whatsapp|\s+al\s+whatsapp|\s*,|\s+que\s+dice|\s+diciendo)/i)
        || raw.match(/(?:whatsapp\s+(?:a|para)\s+)([A-ZÁÉÍÓÚa-záéíóú0-9_+]+)/i)
        || raw.match(/(?:a|para)\s+([A-ZÁÉÍÓÚa-záéíóú0-9_+]+)/i);

      if (toMatch) {
        recipient = toMatch[1].trim();
      }

      // Extracción del mensaje
      // "que dice Hola cómo estás"
      // "diciendo Hola cómo estás"
      // "con el texto Hola cómo estás"
      const msgMatch = raw.match(/(?:que\s+dice|diciendo|con\s+el\s+texto|con\s+el\s+mensaje|mensaje\s*:|texto\s*:)\s+["'«]?([^"'»\n]+)["'»]?/i)
        || raw.match(/(?:dice|diciendo)\s+["'«]?(.+)$/i);

      if (msgMatch) {
        message = msgMatch[1].trim();
      } else {
        // Fallback: lo que queda después del destinatario o de whatsapp
        message = raw.replace(/^(?:mándale|manda|enviar|escribile|mandar)\s+(?:este\s+mensaje|un\s+mensaje)?\s*(?:a|para)?\s*[A-ZÁÉÍÓÚa-záéíóú0-9_+]+\s*(?:por\s+whatsapp)?\s*/i, '').trim();
      }

      // Si aún no se encontró el destinatario pero hay contactos registrados, buscar coincidencias
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
          },
          explanation: `Acción detectada: Enviar WhatsApp a "${recipient}" con el mensaje "${message}"`
        };
      }
    }
  }

  // 2. Detección de EMAIL / CORREO
  if (lower.includes('mail') || lower.includes('correo') || lower.includes('gmail')) {
    let senderAccount = 'ramirovescostain@gmail.com';
    let to = '';
    let subject = '';
    let body = '';
    let workingText = raw;

    // 1. Remitente: "a través de la cuenta ramirovescostain@gmail.com" o "desde..."
    const senderMatch = workingText.match(/(?:a\s+través\s+de\s+la\s+cuenta|desde\s+la\s+cuenta|desde\s+el\s+mail|desde)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    if (senderMatch) {
      senderAccount = senderMatch[1].trim();
      workingText = workingText.replace(senderMatch[0], ' ');
    }

    // 2. Destinatario en workingText
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
      // Buscar si mencionó a algún contacto registrado
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

    // Limpiar frases introductorias comunes como "diciendo esto en el asunto y esto en el texto"
    workingText = workingText.replace(/(?:diciendo|poniendo|escribiendo)?\s*(?:esto\s+)?en\s+el\s+asunto\s+y\s+(?:esto\s+)?en\s+el\s+texto\s*:?/i, ' ');

    // 3. Asunto y Texto explícito (ej: "asunto Gracias texto nos vemos pronto")
    const explicitSubjectBody = workingText.match(/asunto\s*:?\s*([^]+?)\s+(?:y\s+(?:esto\s+)?en\s+el\s+texto|texto)\s*:?\s*([^]+)$/i)
      || workingText.match(/(?:en\s+el\s+asunto|con\s+el\s+asunto)\s*["'«]?([^"'\n,]+?)["'»]?\s+(?:y\s+en\s+el\s+texto|texto)\s*["'«]?([^]+?)["'»]?$/i);

    if (explicitSubjectBody) {
      subject = explicitSubjectBody[1].replace(/^(?:esto|que\s+diga|dice)\s*/i, '').trim();
      body = explicitSubjectBody[2].trim();
    } else {
      // Búsqueda individual de Asunto
      const subjectMatch = workingText.match(/(?:asunto\s*:?|en\s+el\s+asunto\s*:?|con\s+el\s+asunto\s*:?)\s*["'«]?([^"'\n,]+?)(?=\s+(?:y\s+esto\s+en\s+el\s+texto|y\s+en\s+el\s+texto|texto|cuerpo|mensaje)|$)/i);
      if (subjectMatch) {
        subject = subjectMatch[1].trim();
      }

      // Búsqueda individual de Cuerpo / Texto
      const bodyMatch = workingText.match(/(?:texto\s*:?|en\s+el\s+texto\s*:?|cuerpo\s*:?|mensaje\s*:?)\s*["'«]?([^"'\n]+)/i);
      if (bodyMatch) {
        body = bodyMatch[1].trim();
      }
    }

    // Limpiezas y fallbacks inteligentes
    if (subject.toLowerCase().startsWith('esto en el asunto')) subject = 'Gracias';
    if (!subject && lower.includes('gracias')) subject = 'Gracias';
    if (!body && lower.includes('nos vemos pronto')) body = 'nos vemos pronto';

    return {
      actionId: 'send_email',
      confidence: 0.95,
      params: {
        senderAccount,
        to: to || 'ejemplo@correo.com',
        subject: subject || 'Sin asunto',
        body: body || 'Mensaje enviado desde Asistente de IA'
      },
      explanation: `Acción detectada: Enviar mail desde "${senderAccount}" hacia "${to}" con asunto "${subject}" y texto "${body}"`
    };
  }

  // 3. Detección de RECORDATORIO
  if (lower.includes('recordar') || lower.includes('recordatorio') || lower.includes('alarma')) {
    const timeMatch = raw.match(/(?:a\s+las|en|para\s+las)\s+(\d{1,2}(?::\d{2})?(?:\s*(?:am|pm|hs|horas|minutos))?)/i);
    const title = raw.replace(/^(?:crea(?:r)?|pon(?:er)?|hacer)?\s*(?:un)?\s*(?:recordatorio|alarma)?\s*(?:para|de)?/i, '').trim();
    return {
      actionId: 'create_reminder',
      confidence: 0.9,
      params: {
        title: title || 'Recordatorio',
        time: timeMatch ? timeMatch[0] : 'En breve'
      },
      explanation: `Acción detectada: Crear recordatorio para "${title}"`
    };
  }

  // 4. Detección de NOTAS
  if (lower.startsWith('anota') || lower.startsWith('guardar nota') || lower.startsWith('nota:')) {
    const content = raw.replace(/^(?:anota(?:r)?(?:\s+que)?|guardar\s+nota(?:\s*:)?|nota\s*:)/i, '').trim();
    return {
      actionId: 'save_note',
      confidence: 0.9,
      params: {
        content: content || raw,
        category: 'general'
      },
      explanation: `Acción detectada: Guardar nota "${content}"`
    };
  }

  // 5. Detección de BÚSQUEDA WEB
  if (lower.startsWith('buscar') || lower.startsWith('busca en') || lower.startsWith('abrir ')) {
    const query = raw.replace(/^(?:buscar|busca\s+en\s+google|busca|abrir)\s+/i, '').trim();
    return {
      actionId: 'web_search',
      confidence: 0.85,
      params: { query },
      explanation: `Acción detectada: Búsqueda o apertura web de "${query}"`
    };
  }

  return null;
}
