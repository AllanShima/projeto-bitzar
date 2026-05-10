import React, { useState } from 'react'
import { handleGroupVerification } from '../utils/team-logic';
import { useAuth } from '@/features/auth/AuthContext';
import { useTeam, useTeams } from '@/hooks/useTeam';

export const useTeamLoginActions = () => {
    const [loading, setLoading] = useState(false);
    const { user, loading: userLoading } = useAuth(); // Dados do usuário autenticado
    const { 
      data: allTeams, 
      isLoading: isLoadingAll, 
      error: errorAll 
    } = useTeams();

    const handleLoginLogic = async (enterCode: string) => {
      if (userLoading) {
        return "Usuário não carregado!";
      }
      try{
        setLoading(true);
        if (!handleGroupVerification(allTeams ?? [], user?.uid ?? "", enterCode)) {
            return "Grupo não encontrado!";
        }        
      } catch(error) {
            return String(error);
      } finally {
            setLoading(false);
      }
    }
    return { handleLoginLogic, loading }
}
