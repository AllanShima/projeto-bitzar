// import { useState } from 'react';
// import { extractChunksFromPDF } from '../utils/usePdfTextExtractor';

// interface DocumentChunk {
//   text: string;
//   embedding: number[];
// }

// // Banco de dados global do módulo
// let globalVectorStore: DocumentChunk[] = [];

// // 🚀 Escolha seu provedor aqui: 'ollama' ou 'gemini'
// const PROVIDER: 'ollama' | 'gemini' = 'gemini'; 

// // Configurações dos Modelos
// const OLLAMA_MODEL = 'qwen2.5:3b';
// const GEMINI_MODEL = 'gemini-1.5-flash';
// const GEMINI_API_KEY = 'SUA_GEMINI_API_KEY_AQUI'; // Idealmente vindo de um .env

// export const useRAG = () => {
//   const [loading, setLoading] = useState(false);

//   // 1. Transforma os pedaços do PDF em vetores usando o Ollama local (nomic)
//   const processDocsMessages = async (processedDocsList: File[]) => {
//     if (!processedDocsList || processedDocsList.length === 0) return;
    
//     setLoading(true);
//     try {
//       globalVectorStore = []; 
//       console.log("⏳ Indexando arquivos no RAG...");

//       for (const file of processedDocsList) {
//         const chunks = await extractChunksFromPDF(file);

//         for (const chunk of chunks) {
//           const response = await fetch('http://localhost:11434/api/embeddings', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               model: 'nomic-embed-text',
//               prompt: chunk,
//               keep_alive: -1
//             }),
//           });
//           const data = await response.json();
          
//           if (data && data.embedding) {
//             globalVectorStore.push({
//               text: chunk,
//               embedding: data.embedding
//             });
//           }
//         }
//       }
//       console.log(`🚀 RAG: ${globalVectorStore.length} trechos salvos na memória global!`);
//     } catch (e) {
//       console.error("Erro ao processar documentos no RAG:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Função principal do RAG que busca o contexto e delega para o provedor escolhido
//   const generateWithRAG = async (userQuery: string, membersData?: Array<{ fullName?: string, jobPosition?: string, jobDescription?: string }>, fallbackFiles?: File[]) => {
//     try {
//       if (globalVectorStore.length === 0 && fallbackFiles && fallbackFiles.length > 0) {
//         console.log("⚠️ Banco vazio detectado. Forçando indexação...");
//         await processDocsMessages(fallbackFiles);
//       }

//       const currentStore = Array.isArray(globalVectorStore) ? globalVectorStore : [];
//       setLoading(true);

//       // A. Gera embedding da pergunta (mantido local com nomic por velocidade)
//       const responseEmbedding = await fetch('http://localhost:11434/api/embeddings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           model: 'nomic-embed-text', 
//           prompt: userQuery,
//           options: { keep_alive: -1 }
//         }),
//       });
      
//       const queryData = await responseEmbedding.json();
//       if (!queryData || !queryData.embedding) throw new Error("Falha no embedding da pergunta.");

//       // B. Busca por similaridade de cosseno
//       const scoredChunks = currentStore.map(item => {
//         if (!item || !item.embedding) return { text: item?.text || "", score: 0 };
//         const score = cosineSimilarity(queryData.embedding, item.embedding);
//         return { ...item, score };
//       });

//       const topChunks = scoredChunks.sort((a, b) => b.score - a.score).slice(0, 3);
//       const contextText = topChunks.map(item => item?.text || "").filter(Boolean).join('\n\n');

//       const systemPrompt = `Você é um assistente de IA corporativo especialista em análise de documentos.
// Sua tarefa é responder à pergunta do usuário baseando-se estritamente nos [TRECHOS RELEVANTES DO DOCUMENTO] fornecidos.

// Atenção: Ignore informações externas. Se a informação não estiver explicitamente nos trechos do documento, diga de forma clara e direta que não encontrou no arquivo.`;

//       const userPrompt = `[TRECHOS RELEVANTES DO DOCUMENTO]:\n${contextText || "Nenhum contexto disponível."}\n\n[PERGUNTA]:\n${userQuery}`;

//       // C. DELEGAÇÃO DE MODELO: Decide qual API chamar baseado na variável PROVIDER
//       if (PROVIDER === 'gemini') {
//         return await callGeminiAPI(systemPrompt, userPrompt);
//       } else {
//         return await callOllamaAPI(systemPrompt, userPrompt);
//       }

//     } catch (error) {
//       console.error("Erro ao gerar resposta com RAG:", error);
//       return "Desculpe, ocorreu um erro ao processar o documento.";
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { processDocsMessages, generateWithRAG, loading, activeModel: PROVIDER === 'gemini' ? GEMINI_MODEL : OLLAMA_MODEL };
// };

// ---

// // ### Passo 3: As Duas Funções Especializadas Isoladas

// // Adicione estas duas funções auxiliares no final do seu arquivo (fora do hook `useRAG`), de modo que cada uma cuide estritamente da comunicação com as respectivas APIs.

// // #### Função 1: Chamada oficial à API do Gemini
// // A API do Gemini aceita uma estrutura de JSON chamada `contents`. Para passar instruções de sistema (System Prompt), nós usamos o parâmetro `systemInstruction` na rota oficial:

// // ```typescript
// async function callGeminiAPI(systemPrompt: string, userPrompt: string): Promise<string> {
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [{ text: userPrompt }]
//         }
//       ],
//       systemInstruction: {
//         parts: [{ text: systemPrompt }]
//       },
//       generationConfig: {
//         temperature: 0.2, // Temperatura baixa para RAG evitar alucinações
//         maxOutputTokens: 800
//       }
//     })
//   });

//   if (!response.ok) {
//     const errData = await response.json();
//     throw new Error(`Erro na API do Gemini: ${errData.error?.message || response.status}`);
//   }

//   const data = await response.json();
//   // Estrutura de retorno padrão do Gemini para capturar o texto
//   return data.candidates[0].content.parts[0].text;
// }