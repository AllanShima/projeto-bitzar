import { useState } from 'react';
import { useUpdateUser, useUsers } from '@/hooks/usersQuery';
import type { Message, TeamMember } from '@/interfaces/Interfaces';
import { arrayUnion } from 'firebase/firestore';
import { useUpdateTeam } from '@/hooks/teamQuery';

export const useNewMemberActions = () => {
  const updateTeamMutation = useUpdateTeam();
  const { data, isLoading, error } = useUsers()

  const [loading, setLoading] = useState(false);

  const handleNewMember = async (teamId: string, email: string) => {
    try {
        setLoading(true);

        if (isLoading) {
            throw new Error("Usuários ainda carregando!");
        }

        const foundUser = data?.find((u) => u.email == email);

        if (!foundUser) {
            throw new Error("Nenhum usuário com o email correspondente!");
        }

        const newTeamMember: TeamMember = {
            status: 'participant',
            user: foundUser
        };

        await handleUpdate(teamId, newTeamMember);

    } catch (error: unknown) {
        throw error;
    } finally {
        setLoading(false);
    }
  };

    // Salva os novos membros na lista de membros do time/grupo
    const handleUpdate = async (teamId: string, member: TeamMember) => {
        await updateTeamMutation.mutateAsync({
            id: teamId,
            updatedData: {
                members: arrayUnion(member) as any, 
            },
        });
    };

  return { handleNewMember, loading };
};