import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ActionRegistry {
  constructor() {
    this.actions = new Map();
  }

  register(action) {
    if (!action.id) {
      throw new Error('Una acción debe tener un ID único');
    }
    this.actions.set(action.id, action);
    console.log(`[ActionRegistry] Acción registrada: ${action.id} (${action.name})`);
  }

  get(id) {
    return this.actions.get(id);
  }

  getAll() {
    return Array.from(this.actions.values());
  }

  /**
   * Carga automáticamente todos los archivos *.action.js dentro de server/actions
   */
  async loadFromDirectory(dirPath = path.join(__dirname, '../actions')) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.action.js') || f.endsWith('.js'));
    for (const file of files) {
      try {
        const fullPath = path.join(dirPath, file);
        const moduleUrl = pathToFileURL(fullPath).href;
        const imported = await import(moduleUrl);
        const ActionClassOrInstance = imported.default || imported;

        if (typeof ActionClassOrInstance === 'function') {
          const instance = new ActionClassOrInstance();
          this.register(instance);
        } else if (ActionClassOrInstance && ActionClassOrInstance.id) {
          this.register(ActionClassOrInstance);
        }
      } catch (err) {
        console.error(`Error cargando la acción desde ${file}:`, err);
      }
    }
  }

  /**
   * Devuelve las declaraciones de herramientas para Function Calling (OpenAI / Gemini)
   */
  getToolDefinitions() {
    return this.getAll().map(action => action.toToolDefinition ? action.toToolDefinition() : {
      type: 'function',
      function: {
        name: action.id,
        description: action.description,
        parameters: action.parameters
      }
    });
  }

  /**
   * Ejecuta una acción por su ID
   */
  async executeAction(actionId, params, context = {}) {
    const action = this.get(actionId);
    if (!action) {
      throw new Error(`Acción desconocida o no registrada: "${actionId}"`);
    }

    console.log(`[ActionRegistry] Ejecutando "${actionId}" con parámetros:`, params);
    const result = await action.execute(params, context);
    return {
      actionId,
      actionName: action.name,
      params,
      ...result
    };
  }
}

export const registry = new ActionRegistry();
