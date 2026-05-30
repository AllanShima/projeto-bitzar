import { useState } from 'react';
import type { Message, TeamMember, User } from '@/interfaces/Interfaces';
import { useOllama } from '../models/useOllama';
import { arrayUnion } from 'firebase/firestore';
import { useUpdateTeam } from '@/hooks/teamQuery';

export const useTextSubmitActions = () => {
  const updateTeamMutation = useUpdateTeam();
  const { generate, loading: loadingModel, model } = useOllama();
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async (authUser: User, userText: string) => {
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

      await handleUpdate(authUser, [newUserMessage, newAIMessage]);

      // Retorna as duas novas mensagens para a tela se atualizar sozinha
      return { newUserMessage, newAIMessage };
      
    } catch (error: unknown) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (authUser: User, messages: Message[]) => {
    // Se o usuário não tem time carregado ainda, não tenta atualizar nada
    if (!authUser?.teamLoggedIn?.members) {
      console.warn("Aguardando carregamento dos dados do time...");
      return; 
    }
    
    // 1. Mapeia os membros alterando APENAS o membro atual na memória
    const updatedMembers = authUser.teamLoggedIn?.members!.map((member: any) => {
      if (member.id === authUser.id) {
        const currentMessages = member.messages || [];
        return {
          ...member,
          // ✅ CORREÇÃO 1: Usa o operador spread '...messages' para injetar os objetos soltos, 
          // evitando que vire um array aninhado [msg1, msg2, [novaMsg1, novaMsg2]]
          messages: [...currentMessages, ...messages]
        };
      }
      return member; // Mantém os outros membros intocados
    });

    await updateTeamMutation.mutateAsync({
      id: authUser.teamLoggedIn?.id!,
      updatedData: {
        members: updatedMembers as any, 
      },
    });
  }

  return { handleTextSubmit, loading, handleUpdate, model };
};