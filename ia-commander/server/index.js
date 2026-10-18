import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { registry } from './registry/ActionRegistry.js';
import commandRoutes from './routes/command.js';
import actionsRoutes from './routes/actions.js';
import contactsRoutes from './routes/contacts.js';
import historyRoutes from './routes/history.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, '../client')));

// Registrar rutas de la API
app.use('/api/command', commandRoutes);
app.use('/api/actions', actionsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/settings', settingsRoutes);

// Iniciar servidor
async function startServer() {
  try {
    console.log('[Server] Cargando registro de acciones modulares...');
    await registry.loadFromDirectory();
    console.log(`[Server] ${registry.getAll().length} acciones cargadas exitosamente.`);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Asistente de Acciones de IA corriendo exitosamente!`);
      console.log(`📍 Acceso Local: http://localhost:${PORT}`);
      console.log(`📱 Acceso desde tu Celular (mismo Wi-Fi): http://192.168.1.4:${PORT}`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

startServer();
