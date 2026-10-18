import { registry } from '../registry/ActionRegistry.js';
import { db } from '../storage/db.js';
import { parseCommandHeuristic } from './heuristicParser.js';
import { callGemini, callOpenAI } from './llmProviders.js';

export class Agent {
  constructor() {
    this.registry = registry;
    this.db = db;
  }

  /**
   * Procesa un comando de texto ingresado por el usuario
   */
  async processCommand(userPrompt, options = {}) {
    const trimmedPrompt = (userPrompt || '').trim();
    if (!trimmedPrompt) {
      throw new Error('El comando no puede estar vacío');
    }

    const settings = this.db.getSettings();
    const contacts = this.db.getContacts();
    let detectedAction = null;
    let providerUsed = 'heuristico';

    // 1. Intentar con LLM si hay API Key configurada
    if (settings.geminiApiKey && (settings.activeProvider === 'gemini' || settings.activeProvider === 'auto')) {
      try {
        const tools = this.registry.getToolDefinitions();
        const llmResult = await callGemini(trimmedPrompt, tools, settings.geminiApiKey);
        if (llmResult.type === 'function_call') {
          detectedAction = {
            actionId: llmResult.actionId,
            params: llmResult.params,
            confidence: 0.99
          };
          providerUsed = 'gemini';
        }
      } catch (err) {
        console.warn('[Agent] Error en Gemini, usando fallback heurístico:', err.message);
      }
    } else if (settings.openaiApiKey && (settings.activeProvider === 'openai' || settings.activeProvider === 'auto')) {
      try {
        const tools = this.registry.getToolDefinitions();
        const llmResult = await callOpenAI(trimmedPrompt, tools, settings.openaiApiKey);
        if (llmResult.type === 'function_call') {
          detectedAction = {
            actionId: llmResult.actionId,
            params: llmResult.params,
            confidence: 0.99
          };
          providerUsed = 'openai';
        }
      } catch (err) {
        console.warn('[Agent] Error en OpenAI, usando fallback heurístico:', err.message);
      }
    }

    // 2. Si no se detectó con LLM o no hay API Key, usar el parser semántico heurístico
    if (!detectedAction) {
      const heuristicResult = parseCommandHeuristic(trimmedPrompt, contacts);
      if (heuristicResult) {
        detectedAction = heuristicResult;
        providerUsed = 'heuristico_local';
      }
    }

    // Si aún no se pudo identificar ninguna acción
    if (!detectedAction || !detectedAction.actionId) {
      const failedEntry = this.db.addHistoryItem({
        prompt: trimmedPrompt,
        status: 'unrecognized',
        message: 'No se reconoció una acción concreta para este comando.',
        providerUsed
      });
      return {
        success: false,
        status: 'unrecognized',
        message: 'No pude identificar una acción concreta. Prueba con: "mándale este mensaje a Agustina por WhatsApp que dice..." o "mandá un mail a través de la cuenta ramirovescostain@gmail.com a..."',
        prompt: trimmedPrompt,
        historyId: failedEntry.id
      };
    }

    const action = this.registry.get(detectedAction.actionId);
    if (!action) {
      return {
        success: false,
        status: 'action_not_found',
        message: `La acción solicitada "${detectedAction.actionId}" no está registrada en el sistema.`,
        prompt: trimmedPrompt
      };
    }

    // Determinar si se ejecuta de inmediato o si espera confirmación
    const shouldExecute = options.forceExecute !== undefined 
      ? options.forceExecute 
      : (settings.autoExecute || options.autoExecute);

    let executionResult = null;
    let status = 'pending_confirmation';

    if (shouldExecute) {
      try {
        executionResult = await this.registry.executeAction(
          detectedAction.actionId, 
          detectedAction.params, 
          { db: this.db, settings }
        );
        status = executionResult.success ? 'executed' : 'failed';
      } catch (err) {
        executionResult = {
          success: false,
          error: err.message,
          status: 'error'
        };
        status = 'error';
      }
    }

    // Guardar en el historial
    const historyEntry = this.db.addHistoryItem({
      prompt: trimmedPrompt,
      actionId: detectedAction.actionId,
      actionName: action.name,
      params: detectedAction.params,
      status,
      executionResult,
      providerUsed
    });

    return {
      success: true,
      status,
      historyId: historyEntry.id,
      prompt: trimmedPrompt,
      action: {
        id: action.id,
        name: action.name,
        category: action.category,
        description: action.description
      },
      params: detectedAction.params,
      execution: executionResult,
      providerUsed
    };
  }

  /**
   * Ejecuta directamente una acción previamente detectada o confirmada
   */
  async executeConfirmed(actionId, params) {
    const settings = this.db.getSettings();
    const result = await this.registry.executeAction(actionId, params, { db: this.db, settings });
    this.db.addHistoryItem({
      prompt: `[Ejecución directa] ${actionId}`,
      actionId,
      params,
      status: result.success ? 'executed' : 'failed',
      executionResult: result,
      providerUsed: 'manual_confirm'
    });
    return result;
  }
}

export const agent = new Agent();
