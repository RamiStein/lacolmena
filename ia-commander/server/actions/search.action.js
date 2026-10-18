import { BaseAction } from '../registry/BaseAction.js';
import { exec } from 'child_process';

export default class SearchAction extends BaseAction {
  constructor() {
    super({
      id: 'web_search',
      name: 'Buscar en la web / Abrir enlace',
      category: 'navegacion',
      description: 'Abre el navegador web para buscar un término en Google o navegar a una página.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Término de búsqueda o URL.'
          }
        },
        required: ['query']
      },
      examples: [
        'buscar en google recetas con miel',
        'abrir youtube'
      ]
    });
  }

  async execute(params, context) {
    const { query } = params;
    let url = query.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.com') || url.includes('.org') || url.includes('.io') || url.includes('.net')) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    try {
      exec(`start "" "${url}"`, (err) => {
        if (err) console.error('[SearchAction] Error abriendo navegador:', err);
      });
    } catch (e) {
      // Ignorar
    }

    return {
      success: true,
      status: 'opened',
      message: `Búsqueda o enlace abierto en el navegador: ${url}`,
      data: { url }
    };
  }
}
