import React, { useState } from 'react'
import { handleGroupVerification } from '../utils/verification';
import { useTeams } from '@/hooks/teamQuery';
import { useUpdateUser } from '@/hooks/usersQuery';
import type { Team, User } from '@/interfaces/Interfaces';

export const useTeamLoginActions = () => {
  const [loading, setLoading] = useState(false);
  
  // Instancia a mutação aqui
  const updateUserMutation = useUpdateUser();

  const { 
    data: allTeams, 
    // Removidos os itens não utilizados para limpar o escopo de render
  } = useTeams();

  const handleTeamLogin = async (user: User, enterCode: string) => {
    try {
      setLoading(true);
      const userId = user.id;

      if (!userId) throw new Error("ID do usuário não encontrado!");

      // 1. Verifica o código do grupo
      const foundTeam = handleGroupVerification(allTeams ?? [], enterCode);
      if (!foundTeam || Array.isArray(foundTeam)) {
        throw new Error("Grupo não encontrado!");
      }

      // 2. Validações de permissão
      const isOwner = foundTeam.ownerId === userId;
      const isMember = foundTeam.members?.some((m) => m.user?.id === userId);

      if (!isMember && !isOwner) { 
        throw new Error("Você não pertence ao grupo!");
      }

      // 3. AGORA USAMOS MUTATEASYNC! 
      // Isso faz o React esperar a requisição do Firebase terminar de verdade 
      // antes de avançar para o "return" ou para o navigate.
      await updateUserMutation.mutateAsync({
        id: userId,
        updatedData: { 
          teamLoggedIn: foundTeam,
        }
      });
      
      return foundTeam;

    } catch(error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { handleTeamLogin, loading }
}