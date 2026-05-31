import { useState } from 'react';
import type { File, Message, Team, TeamMember, User } from '@/interfaces/Interfaces';
import { arrayUnion } from 'firebase/firestore';
import { useUpdateTeam } from '@/hooks/teamQuery';
import { userService } from '@/services/userService'; // Ajuste o caminho do seu service
import { fileStorageService } from '@/services/fileStorageService';

export const useDeleteFileActions = () => {
    const updateTeamMutation = useUpdateTeam();
    const [loading, setLoading] = useState(false); // ✅ Controle de loading local isolado

    const handleDeleteFile = async (authUser: User, toDeleteFile: File) => {
        try {
            setLoading(true); // Ativa o loading apenas para este botão
            const filePath = toDeleteFile.fileAddress;
            
            await fileStorageService.deleteFileByPath(filePath!);

            const team = authUser.teamLoggedIn!;
            const files = team.files!;
            // 1. Filtra o array mantendo todos os membros, EXCETO o que bate com o ID do usuário
            const updatedFiles = files.filter((f: any) => f.id !== toDeleteFile.id);

            // 2. Faz o update no Firebase
            await updateTeamMutation.mutateAsync({
                id: team.id!,
                updatedData: {
                    files: updatedFiles, 
                },
            });

            return updatedFiles;

        } catch (error: unknown) {
            throw error;
        } finally {
            setLoading(false); // Desativa o loading
        }
    };

    return { handleDeleteFile, loading };
};