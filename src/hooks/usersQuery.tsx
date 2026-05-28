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

// ✅ Accept string | null so it matches your AuthProvider state
export function useUser(userId: string | null) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => {
      // Small safeguard for TypeScript's peace of mind
      if (!userId) throw new Error("User ID is required");
      return userService.getUserById(userId);
    },
    // ✅ This safely prevents the queryFn from running when userId is null
    enabled: !!userId, 
  });
}

// No componente...
// const { data, isLoading, error } = useUser("123");

// --------------------------------------------------------

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });
}

// No componente...
// const { data, isLoading, error } = useUsers();

// --------------------------------------------------------

// Definimos o tipo dos parâmetros que a mutação vai receber
interface UpdateUserParams {
  id: string;
  updatedData: Partial<User>; // Partial permite passar apenas os campos que mudaram
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    // Recebe o ID e os dados, e repassa para o seu serviço
    mutationFn: ({ id, updatedData }: UpdateUserParams) => 
      userService.updateUserById(id, updatedData),
    
    onSuccess: () => {
      // Invalida a lista de usuários para renderizar o dado atualizado na tela
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Opcional: Se você tiver um queryKey específico para um usuário (ex: ['user', id])
      // você também pode invalidá-lo aqui se necessário.
    },
  });
}

// --------------------------------------------------------

// export function useUserProfile() {
//   const { user } = useAuth();

//   return useQuery({
//     queryKey: ['userProfile', user?.uid], // Unique key based on UID
//     queryFn: async () => {
//       if (!user?.uid) return null;
      
//       const docRef = doc(db, "users", user.uid);
//       const res = await getDoc(docRef);
//       return res.data(); // This is your Firestore data
//     },
//     enabled: !!user?.uid, // Only run the query if a user is logged in
//     staleTime: 1000 * 60 * 5, // Cache the profile for 5 minutes
//   });
// }