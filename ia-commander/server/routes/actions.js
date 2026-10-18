import express from 'express';
import { registry } from '../registry/ActionRegistry.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const actions = registry.getAll().map(a => ({
      id: a.id,
      name: a.name,
      category: a.category,
      description: a.description,
      parameters: a.parameters,
      examples: a.examples || []
    }));
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
