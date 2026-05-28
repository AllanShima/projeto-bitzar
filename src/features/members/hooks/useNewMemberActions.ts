import { useState } from 'react';
import { useUpdateUser } from '@/hooks/usersQuery';
import type { Message, TeamMember } from '@/interfaces/Interfaces';
import { arrayUnion } from 'firebase/firestore';

export const useNewMemberActions = (userId: string) => {
  const updateUserMutation = useUpdateUser();
  const [loading, setLoading] = useState(false);

  const handleNewMember = async (email: string) => {
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

    const handleUpdate = async (member: TeamMember) => {
        await updateUserMutation.mutateAsync({
            id: userId,
            updatedData: {
                messages: arrayUnion(member) as any, 
            },
        });
    };

  return { handleTextSubmit, loading, handleUpdate, model };
};