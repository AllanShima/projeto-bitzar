const OLLAMA_MODEL = 'qwen2.5:3b';

export const callOllamaAPI = async ({ systemPrompt, userPrompt }: { systemPrompt: string, userPrompt: string }): Promise<string> => {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: false,
      keep_alive: -1
    }),
  });

  if (!response.ok) throw new Error(`Erro na API do Ollama: ${response.status}`);
  const data = await response.json();
  return data.message.content;
};