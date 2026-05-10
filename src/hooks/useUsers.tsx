import { db } from "@/config/firebase";
import { useAuth } from "@/features/auth/AuthContext";
import type { User } from "@/interfaces/Interfaces";
import { userService } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

// Usando TanStack Query (pra lidar com as funções assíncronas)
// useQuery = fazer buscas
// useMutation = manipulação (editar, criar, etc)

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUser : User) => userService.saveUser(newUser),
    onSuccess: () => {
      // Isso faz a mágica: ele avisa ao useUsers que os dados antigos 
      // estragaram e força uma atualização automática!
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// const createUserMutation = useCreateUser(); // Prepara a criação

// const handleSave = () => {
//   createUserMutation.mutate({ name: "Novo PDF", content: "..." });
// };

// -----------------------------------------------------------

export function useUser(userId : string) {
  // 'users' é a chave única do cache. Se mudar o fileId, ele busca de novo.
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUserById(userId),
  });
}

// No componente...
// const { data, isLoading, error } = useUser("123");

// --------------------------------------------------------

export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userProfile', user?.uid], // Unique key based on UID
    queryFn: async () => {
      if (!user?.uid) return null;
      
      const docRef = doc(db, "users", user.uid);
      const res = await getDoc(docRef);
      return res.data(); // This is your Firestore data
    },
    enabled: !!user?.uid, // Only run the query if a user is logged in
    staleTime: 1000 * 60 * 5, // Cache the profile for 5 minutes
  });
}