import { useState } from 'react';
import { extractChunksFromPDF } from '../utils/usePdfTextExtractor';
import { cosineSimilarity } from '../utils/cosineSimilarity';
import { callGeminiAPI } from './services/geminiService';
import { callOllamaAPI } from './services/ollamaService';

interface DocumentChunk {
  text: string;
  embedding: number[];
}

// Banco de dados em memória persistido no escopo do módulo
let globalVectorStore: DocumentChunk[] = [];

export const useRAG = (providerParam: string) => {
  const [loading, setLoading] = useState(false);

  // 1. Gera e armazena os embeddings locais dos documentos
  const processDocsMessages = async (processedDocsList: File[]) => {
    if (!processedDocsList || processedDocsList.length === 0) return;
    
    setLoading(true);
    try {
      globalVectorStore = []; 
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
              keep_alive: -1
            }),
          });
          const data = await response.json();
          
          if (data?.embedding) {
            globalVectorStore.push({
              text: chunk,
              embedding: data.embedding
            });
          }
        }
      }
      console.log(`🚀 RAG: ${globalVectorStore.length} trechos indexados com sucesso!`);
    } catch (e) {
      console.error("Erro ao processar documentos no RAG:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Orquestra a busca por similaridade e dispara a requisição para o serviço correto
  const generateWithRAG = async (userQuery: string, membersData?: any, fallbackFiles?: File[]) => {
    try {
      if (globalVectorStore.length === 0 && fallbackFiles && fallbackFiles.length > 0) {
        await processDocsMessages(fallbackFiles);
      }

      const currentStore = Array.isArray(globalVectorStore) ? globalVectorStore : [];
      setLoading(true);

      // A. Busca vetor da pergunta (Nomic local)
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

      // B. Filtro de Cosseno
      const scoredChunks = currentStore.map(item => {
        if (!item?.embedding) return { text: item?.text || "", score: 0 };
        const score = cosineSimilarity(queryData.embedding, item.embedding);
        return { ...item, score };
      });

      let contextText = "";

      // 🚀 O PULO DO GATO DO DESENVOLVEDOR:
      // Se o banco total de chunks for muito pequeno (ex: menos de 5 chunks), 
      // injeta tudo direto! Não deixa o cosseno escolher qual página ignorar.
      if (currentStore.length <= 5) {
        contextText = currentStore.map(item => item?.text || "").filter(Boolean).join('\n\n');
        console.log("📝 Documento pequeno detectado. Injetando todas as páginas no contexto.");
      } else {
        // Se for um documento gigante, aí sim o filtro de cosseno trabalha:
        const topChunks = scoredChunks.sort((a, b) => b.score - a.score).slice(0, 7);
        contextText = topChunks.map(item => item?.text || "").filter(Boolean).join('\n\n');
      }

      console.log("CONTEÚDO DO CONTEXTO INJETADO:", contextText);

      // C. Definição dos Prompts estruturados (Injetando contextualmente os dados dos membros)
      const systemPrompt = `Você é um assistente corporativo que analisa dados com lógica estrita.
      Sua tarefa é responder perguntas comparando o cargo do usuário em [MEMBROS DA EQUIPE] com as regras textuais de [TRECHOS RELEVANTES DO DOCUMENTO].

      Regras de Ouro de Resposta:
      1. Comece a primeira linha da resposta com uma afirmação direta: "Sim, você pode." ou "Não, você não pode."
      2. Em seguida, cite textualmente o trecho do documento que justifica a sua resposta.
      3. Se o documento contiver uma proibição absoluta (ex: "É terminantemente proibido o uso de any"), essa regra anula qualquer exceção, não importa o cargo do usuário.
      4. Mantenha as frases curtas, sem rodeios ou contradições. Nunca diga que o usuário "pode e não pode" na mesma resposta.`;

      // Converte o JSON dos membros em uma string formatada para o prompt
      const teamContext = membersData && membersData.length > 0 
        ? JSON.stringify(membersData, null, 2) 
        : "Nenhum dado extra sobre outros membros da equipe foi fornecido.";

      const userPrompt = `[MEMBROS DA EQUIPE]:
${teamContext}

[TRECHOS RELEVANTES DO DOCUMENTO]:
${contextText || "Nenhum contexto extraído do PDF está disponível."}

[PERGUNTA DO USUÁRIO]:
${userQuery}`;

      // D. Execução baseada na estratégia escolhida
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