import express from 'express';
import { db } from '../storage/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.getContacts());
});

router.post('/', (req, res) => {
  const { name, phone, email, notes, id } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'El nombre del contacto es obligatorio.' });
  }
  const contact = db.saveContact({ id, name, phone, email, notes });
  res.json(contact);
});

router.delete('/:id', (req, res) => {
  db.deleteContact(req.params.id);
  res.json({ success: true });
});

export default router;
