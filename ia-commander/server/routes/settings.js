import express from 'express';
import { db } from '../storage/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const settings = { ...db.getSettings() };
  // Enmascarar ligeramente para visualización segura
  if (settings.smtpPass) {
    settings.hasSmtpPass = true;
    settings.smtpPassMasked = '••••••••••••';
  } else {
    settings.hasSmtpPass = false;
  }
  if (settings.geminiApiKey) {
    settings.hasGeminiApiKey = true;
  }
  if (settings.openaiApiKey) {
    settings.hasOpenaiApiKey = true;
  }
  res.json(settings);
});

router.post('/', (req, res) => {
  try {
    const updates = req.body;
    // Si la contraseña vino enmascarada y no se cambió, no sobrescribir
    if (updates.smtpPass === '••••••••••••') {
      delete updates.smtpPass;
    }
    const updated = db.updateSettings(updates);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
