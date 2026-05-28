import { useState } from 'react';
import type { Team, TeamMember } from '@/interfaces/Interfaces';
import { arrayUnion } from 'firebase/firestore';
import { useUpdateTeam } from '@/hooks/teamQuery';
import { userService } from '@/services/userService'; // Ajuste o caminho do seu service

export const useNewMemberActions = () => {
  const updateTeamMutation = useUpdateTeam();
  const [loading, setLoading] = useState(false); // ✅ Controle de loading local isolado

  const handleNewMember = async (team: Team, email: string) => {
    try {
      setLoading(true); // Ativa o loading apenas para este botão

      // 1. Busca o usuário de forma isolada e cirúrgica por e-mail
      const foundUser = await userService.getUserByEmail(email);

      if (!foundUser) {
        throw new Error("Nenhum usuário cadastrado com esse e-mail!");
      }
      
      if (foundUser.id === team.ownerId) {
        throw new Error("Este usuário já é o dono do grupo!");
      }
      // Se já tiver um membro com o mesmo email que eu quero adicionar, esse usuário já está no grupo
      const foundMember = team.members?.find((m) => m.user?.email == email)
      
      if (foundMember) {
        throw new Error("Usuário já está no grupo/time!");
      }

      // Evitar duplicados locais (Opcional, mas bom)
      const alreadyMember = team.members?.some(m => m.user?.id === foundUser.id);
      if (alreadyMember) {
        throw new Error("Este usuário já faz parte do grupo!");
      }

      const newTeamMember: TeamMember = {
        status: 'participant',
        user: foundUser
      };

      // 2. Faz o update no Firebase
      await updateTeamMutation.mutateAsync({
        id: team.id!,
        updatedData: {
          members: arrayUnion(newTeamMember) as any, 
        },
      });

    } catch (error: unknown) {
      throw error;
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return { handleNewMember, loading };
};