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
  const updateUserMutation = useUpdateUser();

  const { 
    data: allTeams, 
    isLoading: isLoadingAll, 
    error: errorAll 
  } = useTeams();

  // 2. Fetching a specific team
  const { 
    data: singleTeam, 
    isLoading: isLoadingSingle, 
    error: errorSingle 
  } = useTeamById(user?.id);

  const createTeamMutation = useCreateTeam(); // Prepara a criação

  const handleSave = (title: string, description: string, code: string) => {
    createTeamMutation.mutate({ title: title, description: description, code: code, ownerId: user?.id });
  };

  const handleTeamRegister = async (title: string, description: string, code: string) => {
    try {
      setLoading(true);
      if (singleTeam && singleTeam.length >= 1) {
        throw new Error ("Você já criou um grupo!");
      }

      await handleSave(title, description, code); // Salva os dados no banco

    } catch(error) {
      if (error instanceof FirebaseError) {
        // Aqui o TS sabe que 'error' tem as propriedades 'code' e 'message'
        return error.message;
      } else {
        // Trata erros que não são do Firebase (ex: erro de rede genérico)
        return "Ocorreu um erro inesperado!";
      }
    } finally{
      setLoading(false);
    }
  }


  return { handleTeamRegister, loading }
}

