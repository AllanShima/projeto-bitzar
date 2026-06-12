import { useEffect, useState } from 'react';
import type { Message, TeamMember, User } from '@/interfaces/Interfaces';
import { useRAG } from './useRAG';
import { arrayUnion } from 'firebase/firestore';
import { useUpdateTeam } from '@/hooks/teamQuery';
import { convertUrlToFile } from '@/features/chat/utils/useConvertUrlToFile'

export const useTextSubmitActions = (authUser: User, PROVIDER: string) => {
  const updateTeamMutation = useUpdateTeam();
  const { generateWithRAG, processDocsMessages, loading: loadingModel, activeProvider: provider } = useRAG(PROVIDER);
  const [loading, setLoading] = useState(false);

  const isThereFiles = (authUser.teamLoggedIn?.files?.length ?? 0) >= 1;
  const isThereUsers = (authUser.teamLoggedIn?.members?.length ?? 0) > 1;

  // COLOCAR DENTRO DO USEEFFECT É OBRIGATÓRIO!
  useEffect(() => {
    if (isThereFiles || isThereUsers) {
      const urlsList = authUser.teamLoggedIn?.files!.map(f => f.fileAddress).filter(Boolean) || [];

      const loadFilesAndProcess = async () => {
        try {
          console.log("Iniciando conversão de arquivos...");
          const filesList: File[] = await Promise.all(
            urlsList.map((url, index) => convertUrlToFile(url!, `arquivo_${index}.pdf`))
          );

          console.log("Arquivos convertidos com sucesso:", filesList);
          await processDocsMessages(filesList);

        } catch (error) {
          console.error("Erro ao converter as URLs em arquivos File:", error);
        }
      };

      loadFilesAndProcess();
    }
    // 🎯 CORREÇÃO NAS DEPENDÊNCIAS: 
    // Em vez de passar o objeto array completo, passamos o LENGTH (comprimento) dele ou deixamos vazio [].
    // Assim, ele só vai rodar de novo se o número de arquivos REALMENTE mudar (ex: o usuário upou um PDF novo).
    }, [authUser.teamLoggedIn?.files?.length, isThereFiles, isThereUsers]);

  useEffect(() => {
    setLoading(loadingModel);
  }, [loadingModel])

  const handleTextSubmit = async (userText: string) => {
    try {
      if (loadingModel) throw new Error("O modelo de IA ainda está carregando!");

      setLoading(true);

      const newUserMessage: Message = {
        role: 'user',
        content: userText,
        createdAt: new Date(),
      };

      const groupMembers = authUser.teamLoggedIn?.members || [];

      // Função auxiliar para normalizar o cargo e bater com os tokens do PDF
      const normalizeJobPosition = (position: string): string => {
        const lower = position.toLowerCase();
        if (lower.includes('sênior') || lower.includes('senior') || lower.includes('arquiteto')) {
          return 'Desenvolvedor Sênior / Arquiteto';
        }
        if (lower.includes('pleno')) {
          return 'Desenvolvedor Pleno';
        }
        if (lower.includes('júnior') || lower.includes('junior')) {
          return 'Desenvolvedor Júnior';
        }
        return position;
      };

      let convertedUsersData = groupMembers
        .filter((m) => m.user?.id !== authUser.id)
        .map((m) => ({
          fullName: `${m.user?.firstName || ""} ${m.user?.lastName || ""}`.trim(),
          jobPosition: normalizeJobPosition(m.user?.jobPosition || "Não informado"),
          jobDescription: m.user?.jobDescription || "Não informado"
        }));

      if (convertedUsersData.length === 0) {
        convertedUsersData = [
          {
            fullName: `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim(),
            jobPosition: normalizeJobPosition(authUser.jobPosition || "Não informado"),
            jobDescription: authUser.jobDescription || "Não informado"
          }
        ];
      }

      // Dispara para o RAG com os cargos perfeitamente alinhados aos tokens do PDF
      const aiResponse = await generateWithRAG(userText, convertedUsersData);

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
      if (member.user.id == authUser.id) {
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

  return { handleTextSubmit, loading, handleUpdate, provider };
};