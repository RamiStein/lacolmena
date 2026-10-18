/**
 * Clase base para todas las acciones que el Asistente de IA puede ejecutar.
 * Para agregar una nueva acción, simplemente extiende esta clase o exporta un objeto
 * con esta misma estructura en el directorio server/actions/.
 */
export class BaseAction {
  constructor({ id, name, description, category = 'general', parameters = {}, examples = [] }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.parameters = parameters; // JSON Schema de parámetros requeridos
    this.examples = examples;
  }

  /**
   * Método que ejecuta la acción en el sistema real.
   * @param {Object} params - Parámetros extraídos por la IA
   * @param {Object} context - Base de datos, configuración y utilidades
   * @returns {Promise<Object>} Resultado con success, message, data, etc.
   */
  async execute(params, context) {
    throw new Error(`El método execute() no ha sido implementado para la acción ${this.id}`);
  }

  /**
   * Genera el formato de herramienta compatible con Gemini y OpenAI Tool Calling.
   */
  toToolDefinition() {
    return {
      type: 'function',
      function: {
        name: this.id,
        description: this.description,
        parameters: this.parameters
      }
    };
  }
}
