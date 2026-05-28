import { useState } from 'react';
import { useUpdateUser } from '@/hooks/usersQuery';
import type { Message } from '@/interfaces/Interfaces';
import { useOllama } from '../models/useOllama';
import { arrayUnion } from 'firebase/firestore';

export const useTextSubmitActions = (userId: string) => {
  const updateUserMutation = useUpdateUser();
  const { generate, loading: loadingModel, model } = useOllama();
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async (userText: string) => {
    try {
      if (loadingModel) throw new Error("O modelo de IA ainda está carregando!");

      setLoading(true);

      const newUserMessage: Message = {
        role: 'user',
        content: userText,
        createdAt: new Date(),
      };

      // 1. Gera a resposta da IA
      const aiResponse = await generate(userText);

      const newAIMessage: Message = {
        role: 'ai',
        content: aiResponse || "Desculpe, não consegui processar sua resposta.",
        createdAt: new Date(),
      };

      // 2. Salva ambas as mensagens no Firebase usando mutateAsync de forma sequencial
      // (Supondo que seu service use arrayUnion ou salve o payload completo ajustado)
      await handleUpdate(newUserMessage);
      await handleUpdate(newAIMessage);

      // Retorna as duas novas mensagens para a tela se atualizar sozinha
      return { newUserMessage, newAIMessage };
    } catch (error: unknown) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

    const handleUpdate = async (message: Message) => {
        // ✅ O arrayUnion diz ao Firebase para adicionar o item no final do array 'messages' existente lá no servidor
        await updateUserMutation.mutateAsync({
            id: userId,
            updatedData: {
                messages: arrayUnion(message) as any, 
            },
        });
    };

  return { handleTextSubmit, loading, handleUpdate, model };
};