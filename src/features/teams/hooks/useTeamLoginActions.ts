import React, { useId, useState } from 'react'
import { handleGroupVerification } from '../utils/verification';
import { useAuth } from '@/features/auth/AuthContext';
import { useTeams } from '@/hooks/teamQuery';
import { useUpdateUser } from '@/hooks/usersQuery';
import type { Team } from '@/interfaces/Interfaces';

export const useTeamLoginActions = () => {
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useAuth(); // Dados do usuário autenticado
  const updateUserMutation = useUpdateUser();

  const { 
    data: allTeams, 
    isLoading: isLoadingAll, 
    error: errorAll 
  } = useTeams();

  const handleTeamLogin = async (enterCode: string) => {
    try{

    if (userLoading) {
      throw new Error("Usuário não carregado!");
    }

      setLoading(true);

      const foundTeam = handleGroupVerification(allTeams ?? [], enterCode);
      if (!foundTeam || Array.isArray(foundTeam)) {
        throw new Error("Grupo não encontrado!");
      }

      if (user?.id) {
        await handleUpdate(user?.id, foundTeam);
      } else {
        throw new Error("Erro ao carregar usuário logado!");
      }

      return foundTeam;

    } catch(error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = (userId: string, team: Team) => {
    updateUserMutation.mutate({
      id: userId,
      updatedData: { 
        teamLoggedIn: team,
      }
    });
  };

  return { handleTeamLogin, loading }
}
