import { useState } from 'react';
import type { File as IFile, Message, Team, TeamMember, User } from '@/interfaces/Interfaces';
import { arrayUnion } from 'firebase/firestore';
import { useUpdateTeam } from '@/hooks/teamQuery';
import { userService } from '@/services/userService'; // Ajuste o caminho do seu service
import { fileStorageService } from '@/services/fileStorageService';

export const useNewFileActions = () => {
  const updateTeamMutation = useUpdateTeam();
  const [loading, setLoading] = useState(false); // ✅ Controle de loading local isolado

  const handleNewFile = async (authUser: User, file: File, fileDescription: string) => {
    try {
        setLoading(true); // Ativa o loading apenas para este botão

        if (!file) {
          throw new Error('No file provided');
        }
        const teamTitle = authUser.teamLoggedIn?.title;
        const savedFile = await fileStorageService.saveFile(teamTitle!, file) as unknown as { size: number; url: string };
        // retorna {
        //     size: number,
        //     url: string
        // }

        const newFile: IFile = {
            id: generateRandomId(),
            name: file.name,
            description: fileDescription,
            fileAddress: savedFile.url,
            fileSize: savedFile.size,
            uploadedBy: authUser,
            createdAt: new Date()
        };

        // 2. Faz o update no Firebase
        await updateTeamMutation.mutateAsync({
            id: authUser.teamLoggedIn!.id!,
            updatedData: {
                files: arrayUnion(newFile) as any, 
            },
        });

        return newFile;

    } catch (error: unknown) {
        throw error;
    } finally {
        setLoading(false); // Desativa o loading
    }
  };

    const generateRandomId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

  return { handleNewFile, loading };
};