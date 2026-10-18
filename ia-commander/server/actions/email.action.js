import { BaseAction } from '../registry/BaseAction.js';
import nodemailer from 'nodemailer';
import { exec } from 'child_process';

export default class EmailAction extends BaseAction {
  constructor() {
    super({
      id: 'send_email',
      name: 'Enviar correo electrónico',
      category: 'correo',
      description: 'Envía un correo electrónico a través de una cuenta de Gmail (ej: ramirovescostain@gmail.com) hacia un destinatario, con asunto y contenido.',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            description: 'Dirección de correo electrónico del destinatario o nombre de contacto.'
          },
          subject: {
            type: 'string',
            description: 'Asunto o título del correo.'
          },
          body: {
            type: 'string',
            description: 'Texto o cuerpo del mensaje.'
          },
          senderAccount: {
            type: 'string',
            description: 'Cuenta remitente desde la que se enviará (ej: ramirovescostain@gmail.com).'
          }
        },
        required: ['to', 'subject', 'body']
      },
      examples: [
        'mandá un mail a través de la cuenta ramirovescostain@gmail.com a este mail ejemplo diciendo esto en el asunto Gracias y esto en el texto nos vemos pronto',
        'enviar correo a contacto@empresa.com asunto Presupuesto cuerpo Adjunto lo solicitado'
      ]
    });
  }

  async execute(params, context) {
    const { to, subject, body, senderAccount } = params;
    const db = context.db;
    const settings = db ? db.getSettings() : {};

    const sender = senderAccount || settings.defaultEmailSender || 'ramirovescostain@gmail.com';
    let targetEmail = to.trim();

    // Resolver si el destinatario es un nombre de contacto
    if (db && !targetEmail.includes('@')) {
      const contact = db.findContact(targetEmail);
      if (contact && contact.email) {
        targetEmail = contact.email;
      }
    }

    const encodedSubject = encodeURIComponent(subject || '');
    const encodedBody = encodeURIComponent(body || '');
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;

    // Si cuenta con contraseña de aplicación SMTP configurada, enviamos directamente vía Nodemailer
    if (settings.smtpPass && settings.smtpPass.trim().length > 0) {
      try {
        const transporter = nodemailer.createTransport({
          host: settings.smtpHost || 'smtp.gmail.com',
          port: Number(settings.smtpPort) || 465,
          secure: settings.smtpSecure !== false,
          auth: {
            user: settings.smtpUser || sender,
            pass: settings.smtpPass.trim()
          }
        });

        const info = await transporter.sendMail({
          from: `"${sender.split('@')[0]}" <${sender}>`,
          to: targetEmail,
          subject: subject,
          text: body,
          html: `<p style="font-family: Arial, sans-serif; font-size: 14px; color: #222;">${body.replace(/\n/g, '<br>')}</p>`
        });

        return {
          success: true,
          status: 'sent_smtp',
          message: `Correo enviado exitosamente desde ${sender} a ${targetEmail} vía SMTP Gmail.`,
          data: {
            messageId: info.messageId,
            sender,
            to: targetEmail,
            subject,
            body,
            gmailWebUrl
          }
        };
      } catch (err) {
        console.error('[EmailAction] Error enviando por SMTP:', err.message);
        // Fallback si la contraseña falló
        return {
          success: false,
          status: 'smtp_error',
          message: `Error al autenticar con Gmail SMTP: ${err.message}. Puedes abrir el borrador listo para enviar con 1 clic.`,
          data: {
            sender,
            to: targetEmail,
            subject,
            body,
            gmailWebUrl,
            mailtoUrl,
            error: err.message
          }
        };
      }
    }

    // Si aún no configuró la Contraseña de Aplicación de Gmail:
    // Abrimos el compositor de Gmail Web o cliente predeterminado con los datos listos
    try {
      exec(`start "" "${gmailWebUrl}"`, (err) => {
        if (err) console.error('[EmailAction] Error abriendo Gmail Web:', err);
      });
    } catch (e) {
      // Ignorar
    }

    return {
      success: true,
      status: 'opened_in_browser',
      message: `Borrador generado y abierto en Gmail para enviar a ${targetEmail}. (Para envío automático 100% en segundo plano, añade tu Contraseña de Aplicación de Gmail en Ajustes).`,
      data: {
        sender,
        to: targetEmail,
        subject,
        body,
        gmailWebUrl,
        mailtoUrl,
        smtpReady: false
      }
    };
  }
}
