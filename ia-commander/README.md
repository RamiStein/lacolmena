# ⚡ CommandAI • Asistente de Acciones de IA

Aplicación de asistencia inteligente para comandar acciones concretas mediante lenguaje natural (escrito o dictado por voz):
- **WhatsApp**: Envío automático y generación de enlaces directos a contactos (ej: *"mándale este mensaje a Agustina por WhatsApp que dice Hola cómo estás"*).
- **Email / Gmail**: Envío de correos desde tu cuenta personal (ej: `ramirovescostain@gmail.com`) con destinatario, asunto y texto (ej: *"mandá un mail a través de la cuenta ramirovescostain@gmail.com a este mail ejemplo@... diciendo esto en el asunto Gracias y esto en el texto nos vemos pronto"*).
- **Extensibilidad Abierta**: Arquitectura modular basada en `ActionRegistry` para agregar nuevas acciones lentamente (calendario, notas, recordatorios, Spotify, etc.) en archivos aislados.

---

## 🚀 Inicio Rápido

1. Entra a la carpeta de la aplicación:
   ```bash
   cd ia-commander
   ```
2. Instala las dependencias (ya instaladas):
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```
4. Abre en tu navegador:
   **[http://localhost:3005](http://localhost:3005)**

---

## 💬 Ejemplos de Comandos Soportados

- `mándale este mensaje a Agustina por WhatsApp que dice Hola cómo estás`
- `mandá un mail a través de la cuenta ramirovescostain@gmail.com a este mail agustina@ejemplo.com diciendo esto en el asunto Gracias y esto en el texto nos vemos pronto`
- `crea un recordatorio para revisar la kermess a las 18:00`
- `anota que la clave del portón es 4455`
- `buscar en google el clima de hoy`

---

## 🧩 Cómo Agregar Más Acciones (Extensibilidad)

Para agregar una nueva acción, simplemente crea un nuevo archivo en `server/actions/nombre.action.js`:

```javascript
import { BaseAction } from '../registry/BaseAction.js';

export default class MiNuevaAccion extends BaseAction {
  constructor() {
    super({
      id: 'mi_accion',
      name: 'Nombre de la Acción',
      category: 'general',
      description: 'Qué hace la acción para que la IA la reconozca.',
      parameters: {
        type: 'object',
        properties: {
          param1: { type: 'string', description: 'Descripción del parámetro' }
        },
        required: ['param1']
      }
    });
  }

  async execute(params, context) {
    // Código que ejecuta la acción en Windows, Node, API externa, etc.
    return {
      success: true,
      message: `Acción ejecutada con ${params.param1}`
    };
  }
}
```

El servidor detecta automáticamente el archivo y la IA aprende a usarlo sin configuración extra.
