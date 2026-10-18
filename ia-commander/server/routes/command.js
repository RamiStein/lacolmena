import express from 'express';
import { agent } from '../engine/agent.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { prompt, autoExecute, forceExecute } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'El campo "prompt" es requerido.' });
    }
    const result = await agent.processCommand(prompt, { autoExecute, forceExecute });
    res.json(result);
  } catch (err) {
    console.error('Error procesando comando:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/confirm', async (req, res) => {
  try {
    const { actionId, params } = req.body;
    if (!actionId) {
      return res.status(400).json({ error: 'actionId es requerido.' });
    }
    const result = await agent.executeConfirmed(actionId, params || {});
    res.json(result);
  } catch (err) {
    console.error('Error confirmando acción:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
