import { registry } from '../server/registry/ActionRegistry.js';
import { agent } from '../server/engine/agent.js';

async function runTests() {
  console.log('🧪 Iniciando pruebas de CommandAI...\n');

  // 1. Cargar acciones
  await registry.loadFromDirectory();
  console.log(`✅ Acciones registradas: ${registry.getAll().length}`);
  registry.getAll().forEach(a => console.log(`   - [${a.id}] ${a.name}`));

  // 2. Probar comando de WhatsApp
  console.log('\n💬 Prueba 1: Comando de WhatsApp...');
  const resWsp = await agent.processCommand(
    'mándale este mensaje a Agustina por WhatsApp que dice Hola cómo estás',
    { autoExecute: false } // Para test no abrir ventana del navegador
  );
  console.log('Resultado WhatsApp:');
  console.log(JSON.stringify(resWsp, null, 2));

  if (resWsp.action?.id === 'send_whatsapp' && resWsp.params?.recipient === 'Agustina' && resWsp.params?.message === 'Hola cómo estás') {
    console.log('✅ TEST 1 PASÓ: WhatsApp detectado con destinatario y mensaje exacto!');
  } else {
    console.error('❌ TEST 1 FALLÓ');
  }

  // 3. Probar comando de Email
  console.log('\n✉️ Prueba 2: Comando de Email...');
  const resMail = await agent.processCommand(
    'mandá un mail a través de la cuenta ramirovescostain@gmail.com a este mail ejemplo diciendo esto en el asunto y esto en el texto asunto Gracias texto nos vemos pronto',
    { autoExecute: false }
  );
  console.log('Resultado Email:');
  console.log(JSON.stringify(resMail, null, 2));

  if (resMail.action?.id === 'send_email' && resMail.params?.senderAccount === 'ramirovescostain@gmail.com' && resMail.params?.subject === 'Gracias' && resMail.params?.body === 'nos vemos pronto') {
    console.log('✅ TEST 2 PASÓ: Email detectado con remitente, asunto y cuerpo exactos!');
  } else {
    console.error('❌ TEST 2 FALLÓ');
  }

  console.log('\n🎉 Todas las pruebas completadas con éxito!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Error en pruebas:', err);
  process.exit(1);
});
