import { useAuth } from '@/features/auth/AuthContext';
import { useCreateTeam, useTeamById, useTeams } from '@/hooks/teamQuery';
import { FirebaseError } from 'firebase/app';
import React, { useState } from 'react'
import { handleGroupVerification } from '../utils/verification';
import { useUpdateUser } from '@/hooks/usersQuery';
import type { Team, TeamMember, User } from '@/interfaces/Interfaces';

export const useTeamRegisterActions = () => {
  const [loading, setLoading] = useState(false);
  const createTeamMutation = useCreateTeam(); // Prepara a criação

  const { 
    data: allTeams, 
    isLoading: isLoadingAll, 
    error: errorAll 
  } = useTeams();

  const handleTeamRegister = async (user: User, title: string, description: string, code: string) => {
    try {
      setLoading(true);

      const userId = user.id;

      const verifyTeamCreated = allTeams?.find((t) => t.ownerId == userId)
      if (verifyTeamCreated) {
        throw new Error("Você já criou um grupo!");
      }
      const verifyCodeUnification = allTeams?.find((t) => t.code == code)
      if (verifyCodeUnification) {
        throw new Error("Código já foi usado!");
      }

      await handleSave(user, title, description, code); // Salva os dados no banco

      if (createTeamMutation.isError){

        throw new Error(String(createTeamMutation.error));
      }

    } catch(error) {
      throw error;
    } finally{
      setLoading(false);
    }
  }

  const handleSave = (user: User, title: string, description: string, code: string) => {
    const newTeam: Team = {
      title: title,
      description: description,
      code: code,
      ownerId: user.id,
      members: [{
        status: 'owner',
        user: user,
        messages: []
      }] as TeamMember[],
    }
    createTeamMutation.mutate(newTeam);
  };

  return { handleTeamRegister, loading }
}

