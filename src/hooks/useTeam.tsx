import type { Team } from "@/interfaces/Interfaces";
import { teamService } from "@/services/teamService";
import { userService } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Usando TanStack Query (pra lidar com as funções assíncronas)
// useQuery = fazer buscas
// useMutation = manipulação (editar, criar, etc)

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTeam : Team) => teamService.saveTeam(newTeam),
    onSuccess: () => {
      // Isso faz a mágica: ele avisa ao useUsers que os dados antigos 
      // estragaram e força uma atualização automática!
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

// const createTeamMutation = useCreateTeam(); // Prepara a criação

// const handleSave = () => {
//   createTeamMutation.mutate({ name: "Novo PDF", content: "..." });
// };

export function useTeam(ownerId? : string) {
  // 'files' é a chave única do cache. Se mudar o fileId, ele busca de novo.
  return useQuery({
    queryKey: ['teams', ownerId],
    queryFn: () => teamService.getTeamByOwnerId(ownerId!), // Use ! only because 'enabled' ensures it's there
    enabled: !!ownerId, // This is the guard
  });
}

//   const stringUID = user?.uid.toString();
//   const { data, isLoading, error } = useTeam(stringUID);

// -----------------------------------------------------------

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getAllTeams(),
  });
}

// No componente...
// const { data, isLoading, error } = useTeams();