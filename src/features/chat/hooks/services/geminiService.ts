// src/features/chat/hooks/services/geminiService.ts

// 🚀 Mudança definitiva para o modelo estável atual da linha Flash
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_KEY = 'minha_api';

export const callGeminiAPI = async ({ systemPrompt, userPrompt }: { systemPrompt: string, userPrompt: string }): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("A chave da API do Gemini não está definida.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const fullPrompt = `${systemPrompt}\n\nAgora, processe a seguinte entrada baseando-se estritamente nas regras acima:\n${userPrompt}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { 
          role: 'user',
          parts: [{ text: fullPrompt }] 
        }
      ],
      generationConfig: { 
        temperature: 0.2, 
        maxOutputTokens: 800 
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(`Erro na API do Gemini: ${errData.error?.message || response.status}`);
  }

  const data = await response.json();
  
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error("Formato de resposta inesperado da API do Gemini.");
};