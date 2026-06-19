import { useState, useRef } from 'react';
import { extractChunksFromPDF } from '../utils/usePdfTextExtractor';
import { cosineSimilarity } from '../utils/cosineSimilarity';
import { callGeminiAPI } from './services/geminiService';
import { callOllamaAPI } from './services/ollamaService';

interface DocumentChunk {
  text: string;
  embedding: number[];
}

export const useRAG = (providerParam: string) => {
  const [loading, setLoading] = useState(false);

  const vectorStoreRef = useRef<DocumentChunk[]>([]); // aqui fica salvo os chunks

  const processDocsMessages = async (processedDocsList: File[]) => {
    if (!processedDocsList || processedDocsList.length === 0) return;
    
    setLoading(true);
    try {
      vectorStoreRef.current = []; 
      console.log("...Indexando arquivos no RAG...");

      for (const file of processedDocsList) {
        const chunks = await extractChunksFromPDF(file);

        // OTIMIZAÇÃO: Dispara as requisições de embedding em paralelo para o mesmo arquivo
        const embeddingPromises = chunks.map(async (chunk) => {
          try {
            const response = await fetch('http://localhost:11434/api/embeddings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'nomic-embed-text',
                prompt: chunk,
                keep_alive: -1
              }),
            });
            
            if (!response.ok) return null;
            const data = await response.json();
            
            if (data?.embedding) {
              return { text: chunk, embedding: data.embedding };
            }
          } catch (err) {
            console.error("Erro ao obter embedding de um chunk:", err);
          }
          return null;
        });

        // Aguarda todos os chunks do arquivo atual terminarem
        const resolvedChunks = await Promise.all(embeddingPromises);
        
        // Filtra os nulos (erros) e adiciona ao vectorStore
        const validChunks = resolvedChunks.filter((item): item is DocumentChunk => item !== null);
        vectorStoreRef.current = [...vectorStoreRef.current, ...validChunks];
      }
      
      console.log(`RAG: ${vectorStoreRef.current.length} trechos indexados!`);
    } catch (e) {
      console.error("Erro ao processar documentos no RAG:", e);
    } finally {
      setLoading(false);
    }
  };

  const generateWithRAG = async (userQuery: string, membersData?: any, fallbackFiles?: File[]) => {
    try {
      setLoading(true);

      // CORREÇÃO: fallback antes de capturar o estado do vectorStore
      if (vectorStoreRef.current.length === 0 && fallbackFiles && fallbackFiles.length > 0) {
        await processDocsMessages(fallbackFiles);
      }

      // Agora capturamos a referência atualizada pós-fallback
      const currentStore = vectorStoreRef.current;

      if (currentStore.length === 0) {
        console.warn("Nenhum documento indexado na Vector Store.");
      }

      // Busca o embedding da pergunta do usuário
      const responseEmbedding = await fetch('http://localhost:11434/api/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model: 'nomic-embed-text', 
          prompt: userQuery,
          options: { keep_alive: -1 }
        }),
      });
      
      const queryData = await responseEmbedding.json();
      if (!queryData?.embedding) throw new Error("Falha no embedding da pergunta.");

      // Calcula a similaridade
      const scoredChunks = currentStore.map(item => {
        if (!item?.embedding) return { text: item?.text || "", score: 0 };
        const score = cosineSimilarity(queryData.embedding, item.embedding);
        return { ...item, score };
      });

      let contextText = "";

      // Seleção de contexto (Exibe tudo se forem poucos chunks, ou os top 7)
      if (currentStore.length <= 5) {
        contextText = currentStore.map(item => item?.text || "").filter(Boolean).join('\n\n');
      } else {
        const topChunks = scoredChunks.sort((a, b) => b.score - a.score).slice(0, 7);
        contextText = topChunks.map(item => item?.text || "").filter(Boolean).join('\n\n');
      }

      // Prompts estruturados para o LLM
      const systemPrompt = `Você é um assistente corporativo que analisa dados com lógica estrita.
                            Sua tarefa é responder perguntas comparando o cargo do usuário em [MEMBROS DA EQUIPE] com as regras textuais de [TRECHOS RELEVANTES DO DOCUMENTO].

                            Regras de Ouro de Resposta:
                            1. Se for necessário uma resposta direta, recomendo começar com um Sim ou Não.
                            2. Em seguida, cite textualmente o trecho do documento que justifica a sua resposta.
                            3. Se o documento contiver uma proibição absoluta (ex: "É terminantemente proibido o uso de any"), essa regra anula qualquer exceção, não importa o cargo do usuário.
                            4. Mantenha as frases curtas, sem rodeios ou contradições. Nunca diga que o usuário "pode e não pode" na mesma resposta.`;

      const teamContext = membersData && membersData.length > 0 
        ? JSON.stringify(membersData, null, 2) 
        : "Nenhum dado extra sobre outros membros da equipe foi fornecido.";

      const userPrompt = `[MEMBROS DA0315 EQUIPE]:
                          ${teamContext}

                          [TRECHOS RELEVANTES DO DOCUMENTO]:
                          ${contextText || "Nenhum contexto extraído do PDF está disponível."}

                          [PERGUNTA DO USUÁRIO]:
                          ${userQuery}`;

      const providerConfig = { systemPrompt, userPrompt };
      
      if (providerParam === 'gemini') {
        return await callGeminiAPI(providerConfig);
      } else {
        return await callOllamaAPI(providerConfig);
      }

    } catch (error) {
      console.error("Erro ao gerar resposta com RAG:", error);
      return "Desculpe, ocorreu um erro ao processar o documento.";
    } finally {
      setLoading(false);
    }
  };

  return { 
    processDocsMessages, 
    generateWithRAG, 
    loading, 
    activeProvider: providerParam 
  };
};