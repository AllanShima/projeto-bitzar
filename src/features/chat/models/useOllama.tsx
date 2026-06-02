import { useState } from 'react';
import { extractChunksFromPDF } from '../utils/usePdfTextExtractor';
import type { TeamMember } from '@/interfaces/Interfaces';

interface DocumentChunk {
  text: string;
  embedding: number[];
}

// Banco de dados global do módulo
let globalVectorStore: DocumentChunk[] = [];

// modelo de IA sendo usado no momento
const model = 'qwen2.5:3b';

export const useOllama = () => {
  const [loading, setLoading] = useState(false);

  // 1. Função que transforma os pedaços do PDF em vetores e guarda na memória
  const processDocsMessages = async (processedDocsList: File[]) => {
    if (!processedDocsList || processedDocsList.length === 0) return;
    
    setLoading(true);
    try {
      globalVectorStore = []; // Limpa o banco global para novos arquivos
      console.log("⏳ Indexando arquivos no RAG...");

      for (const file of processedDocsList) {
        const chunks = await extractChunksFromPDF(file);

        for (const chunk of chunks) {
          const response = await fetch('http://localhost:11434/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'nomic-embed-text',
              prompt: chunk,
              keep_alive: -1 // 🚀 Mude para cá (na raiz do objeto)
            }),
          });
          const data = await response.json();
          
          if (data && data.embedding) {
            globalVectorStore.push({
              text: chunk,
              embedding: data.embedding
            });
          }
        }
      }

      console.log(`🚀 RAG: ${globalVectorStore.length} trechos do PDF salvos com sucesso na memória global!`);

    } catch (e) {
      console.error("Erro ao processar documentos no RAG:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Função que responde o usuário buscando apenas o trecho certo do PDF
  const generateWithRAG = async (userQuery: string, membersData?: Array<{ fullName?: string, jobPosition?: string, jobDescription?: string }>, fallbackFiles?: File[]) => {
    try {
      // 🛡️ TRAVA AUTOMÁTICA: Se o banco sumiu da memória mas a gente recebeu os arquivos originais, reindexa na hora!
      if (globalVectorStore.length === 0 && fallbackFiles && fallbackFiles.length > 0) {
        console.log("⚠️ Banco vazio detectado. Forçando indexação de emergência do PDF...");
        await processDocsMessages(fallbackFiles);
      }

      const currentStore = Array.isArray(globalVectorStore) ? globalVectorStore : [];

      if (currentStore.length === 0) {
        console.warn("⚠️ Atenção: Nenhum documento foi indexado no RAG ainda. A IA responderá sem contexto.");
      }

      setLoading(true);

      // A. Pede o vetor da pergunta do usuário para o Ollama
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
      
      if (!queryData || !queryData.embedding) {
        console.error("❌ O Ollama não retornou um embedding válido:", queryData);
        throw new Error("Falha ao gerar embedding para a pergunta.");
      }

      const queryVector = queryData.embedding;

      // B. Calcula a similaridade entre a pergunta e os trechos do PDF
      const scoredChunks = currentStore.map(item => {
        if (!item || !item.embedding) return { text: item?.text || "", score: 0 };
        const score = cosineSimilarity(queryVector, item.embedding);
        return { ...item, score };
      });

      // Ordena e pega os 3 melhores
      const topChunks = scoredChunks.sort((a, b) => b.score - a.score).slice(0, 3);
      const contextText = topChunks.map(item => item?.text || "").filter(Boolean).join('\n\n');

      // 👥 NOVA MÁGICA: Transforma o array de membros em um texto legível para a IA
      const membersContext = membersData && membersData.length > 0
        ? membersData.map((m) => `
        Membro ${m.fullName}: Cargo: ${m.jobPosition} | Descrição do Trabalho: ${m.jobDescription}`).join('\n')
        : "Nenhum dado de membro do grupo disponível.";

      // C. Envia para o Ollama gerar a resposta final via rota oficial /api/chat
      const chatResponse = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: `Você é um assistente de IA corporativo. 
              Use as informações do documento fornecido e o contexto dos membros da equipe atual se necessário para responder à pergunta do usuário.
              
              [DADOS DA EQUIPE ATUAL]:
              ${membersContext}
              
              Se a resposta depender estritamente do documento e não for encontrada, diga que não encontrou no arquivo.`
            },
            {
              role: 'user',
              content: `[TRECHOS RELEVANTES DO DOCUMENTO]:\n${contextText || "Nenhum contexto disponível."}\n\n[PERGUNTA]:\n${userQuery}`
            }
          ],
          stream: false,
          keep_alive: -1
        }),
      });
      
      if (!chatResponse.ok) {
        throw new Error(`Erro na API do Ollama: ${chatResponse.status}`);
      }
      
      const chatData = await chatResponse.json();
      return chatData.message.content;
    } catch (error) {
      console.error("Erro ao gerar resposta com RAG:", error);
      return "Desculpe, ocorreu um erro ao processar o documento localmente.";
    } finally {
      setLoading(false);
    }
  };

  return { processDocsMessages, generateWithRAG, loading, model };
};

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i]! * vecB[i]!;
    normA += vecA[i]! * vecA[i]!;
    normB += vecB[i]! * vecB[i]!;
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}