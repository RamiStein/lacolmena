/**
 * Módulo para interactuar con proveedores de LLM (Google Gemini / OpenAI)
 * utilizando llamadas REST nativas con soporte de Tool Calling / Function Calling.
 */

export async function callGemini(prompt, tools, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Formatear herramientas al esquema de Gemini
  const geminiTools = [{
    functionDeclarations: tools.map(t => ({
      name: t.function.name,
      description: t.function.description,
      parameters: t.function.parameters
    }))
  }];

  const systemInstruction = {
    parts: [{
      text: 'Eres el cerebro de un Asistente Personal de Acciones. Tu trabajo es interpretar la orden en lenguaje natural del usuario y llamar a la herramienta adecuada con los parámetros exactos. Si el usuario pide enviar un WhatsApp, usa send_whatsapp; si pide enviar un correo, usa send_email; etc. Devuelve siempre la llamada a la función correspondiente.'
    }]
  };

  const body = {
    systemInstruction,
    contents: [{
      role: 'user',
      parts: [{ text: prompt }]
    }],
    tools: geminiTools,
    toolConfig: {
      functionCallingConfig: {
        mode: 'AUTO'
      }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const parts = candidate?.content?.parts || [];

  for (const part of parts) {
    if (part.functionCall) {
      return {
        type: 'function_call',
        actionId: part.functionCall.name,
        params: part.functionCall.args || {}
      };
    }
  }

  // Si respondió con texto sin llamar función
  const text = parts.map(p => p.text).filter(Boolean).join(' ');
  return {
    type: 'text_response',
    text: text || 'No se pudo determinar una acción específica.'
  };
}

export async function callOpenAI(prompt, tools, apiKey) {
  const url = 'https://api.openai.com/v1/chat/completions';

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Eres el asistente ejecutor de acciones de la computadora del usuario. Mapea la petición a una de las funciones disponibles.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    tools: tools,
    tool_choice: 'auto'
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message;

  if (message?.tool_calls?.length > 0) {
    const call = message.tool_calls[0];
    return {
      type: 'function_call',
      actionId: call.function.name,
      params: JSON.parse(call.function.arguments || '{}')
    };
  }

  return {
    type: 'text_response',
    text: message?.content || 'Comando procesado.'
  };
}
