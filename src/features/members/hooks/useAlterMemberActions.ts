import { useState } from 'react';
import type { Message, Team, TeamMember, User } from '@/interfaces/Interfaces';
import { arrayUnion } from 'firebase/firestore';
import { useUpdateTeam } from '@/hooks/teamQuery';
import { userService } from '@/services/userService'; // Ajuste o caminho do seu service

export const useAlterMemberActions = () => {
    const updateTeamMutation = useUpdateTeam();
    const [loading, setLoading] = useState(false); // ✅ Controle de loading local isolado

    const handleAlterMember = async (authUser: User, toAlterMember: TeamMember, newStatus: TeamMember['status']) => {
        try {
            setLoading(true); // Ativa o loading apenas para este botão
            const team = authUser.teamLoggedIn!;
            const members = team.members!;
            // 1. Filtra o array mantendo todos os membros, EXCETO o que bate com o ID do usuário
            const updatedMembers = members.filter((m: any) => m.user?.id !== toAlterMember.user!.id);

            const updatedMember = toAlterMember;
            updatedMember.status = newStatus;

            updatedMembers.push(updatedMember);

            // 2. Faz o update no Firebase
            await updateTeamMutation.mutateAsync({
                id: team.id!,
                updatedData: {
                    members: updatedMembers, 
                },
            });

            return updatedMembers;

        } catch (error: unknown) {
            throw error;
        } finally {
            setLoading(false); // Desativa o loading
        }
    };

    return { handleAlterMember, loading };
};