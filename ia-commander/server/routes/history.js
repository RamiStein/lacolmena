import express from 'express';
import { db } from '../storage/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.getHistory());
});

router.delete('/', (req, res) => {
  db.clearHistory();
  res.json({ success: true });
});

export default router;
