import { useAuth } from '@/features/auth/AuthContext';
import { useCreateTeam, useTeamById, useTeams } from '@/hooks/teamQuery';
import { FirebaseError } from 'firebase/app';
import React, { useState } from 'react'
import { handleGroupVerification } from '../utils/verification';
import { useUpdateUser } from '@/hooks/usersQuery';
import type { Team } from '@/interfaces/Interfaces';

export const useTeamRegisterActions = () => {
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useAuth(); // Dados do usuário autenticado

  const { 
    data: allTeams, 
    isLoading: isLoadingAll, 
    error: errorAll 
  } = useTeams();

  const createTeamMutation = useCreateTeam(); // Prepara a criação

  const handleTeamRegister = async (userId: string, title: string, description: string, code: string) => {
    try {
      setLoading(true);

      const allUserTeams = allTeams?.find((t) => t.ownerId == userId)
      if (allUserTeams) {
        throw new Error("Você já criou um grupo!");
      }

      await handleSave(userId, title, description, code); // Salva os dados no banco

    } catch(error) {
      throw error;
    } finally{
      setLoading(false);
    }
  }

  const handleSave = (userId: string, title: string, description: string, code: string) => {
    createTeamMutation.mutate({ title: title, description: description, code: code, ownerId: userId });
  };

  return { handleTeamRegister, loading }
}

