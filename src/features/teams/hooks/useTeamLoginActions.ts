import React, { useId, useState } from 'react'
import { handleGroupVerification } from '../utils/verification';
import { useAuth } from '@/features/auth/AuthContext';
import { useTeams } from '@/hooks/teamQuery';
import { useUpdateUser } from '@/hooks/usersQuery';
import type { Team, User } from '@/interfaces/Interfaces';

export const useTeamLoginActions = () => {
  const [loading, setLoading] = useState(false);
  const updateUserMutation = useUpdateUser();

  const { 
    data: allTeams, 
    isLoading: isLoadingAll, 
    error: errorAll 
  } = useTeams();

  const handleTeamLogin = async (user: User, enterCode: string) => {
    try{

      setLoading(true);

      const userId = user.id;

      // verifica o código do grupo
      const foundTeam = handleGroupVerification(allTeams ?? [], enterCode);
      if (!foundTeam || Array.isArray(foundTeam)) {
        throw new Error("Grupo não encontrado!");
      }

      const isOwner = foundTeam.ownerId == userId;
      const isMember = foundTeam.members?.find((m) => m.user?.id == userId)
      if (!isMember && !isOwner) { 
        throw new Error("Você não pertence ao grupo!");
      }

      await handleUpdate(userId!, foundTeam);
      
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
