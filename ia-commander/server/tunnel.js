import localtunnel from 'localtunnel';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INFO_FILE = path.join(__dirname, 'tunnel_info.json');

async function startTunnel() {
  try {
    let publicIp = 'Desconocida';
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      publicIp = ipData.ip;
    } catch (e) {
      // Ignorar si falla
    }

    const tunnel = await localtunnel({ port: 3005 });

    const info = {
      url: tunnel.url,
      publicIp: publicIp,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(INFO_FILE, JSON.stringify(info, null, 2), 'utf-8');

    console.log(`\n======================================================`);
    console.log(`🌐 ENLACE PÚBLICO PARA TU TELÉFONO:`);
    console.log(`🔗 URL: ${tunnel.url}`);
    console.log(`🔑 Contraseña de acceso (IP pública): ${publicIp}`);
    console.log(`======================================================\n`);

    tunnel.on('close', () => {
      console.log('Tunnel cerrado');
    });

    tunnel.on('error', (err) => {
      console.error('Error en tunnel:', err);
    });
  } catch (err) {
    console.error('Error iniciando localtunnel:', err);
  }
}

startTunnel();
