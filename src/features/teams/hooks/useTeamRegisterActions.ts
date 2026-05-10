import { useAuth } from '@/features/auth/AuthContext';
import { useCreateTeam, useTeam } from '@/hooks/useTeam';
import { FirebaseError } from 'firebase/app';
import React, { useState } from 'react'

export const useTeamRegisterActions = () => {
    const [loading, setLoading] = useState(false);
    const { user, loading: userLoading } = useAuth(); // Dados do usuário autenticado

    // 2. Fetching a specific team
    const { 
      data: singleTeam, 
      isLoading: isLoadingSingle, 
      error: errorSingle 
    } = useTeam(user?.uid);

  const createTeamMutation = useCreateTeam(); // Prepara a criação

  const handleSave = (title: string, description: string, code: string) => {
    createTeamMutation.mutate({ title: title, description: description, code: code, ownerId: user?.uid });
  };

  const handleTeamRegister = async (title: string, description: string, code: string) => {

    if (singleTeam && singleTeam.length >= 1) {
      return "Você já criou um grupo!";
    }

    try {
        setLoading(true);
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

