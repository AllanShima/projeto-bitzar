import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fileService } from '../services/fileService';
import type { File, User } from '@/interfaces/Interfaces';

// Usando TanStack Query (pra lidar com as funções assíncronas)
// useQuery = fazer buscas
// useMutation = mudar algo no servidor
export function useFile(fileId : string) {
  // 'files' é a chave única do cache. Se mudar o fileId, ele busca de novo.
  return useQuery({
    queryKey: ['files', fileId],
    queryFn: () => fileService.getFileById(fileId),
  });
}

// No componente...
// const { data, isLoading, error } = useFiles("123");

// -----------------------------------------------------------

export function useFiles() {
  return useQuery({
    queryKey: ['files'],
    queryFn: () => fileService.getAllFiles(),
  });
}

// No componente...
// const { data, isLoading, error } = useFiles();

// -----------------------------------------------------------

export function useCreateFile() {
  const queryClient = useQueryClient();

  // newFile: é o parâmetro que representa os dados que vou passar eventualmente na UI
  return useMutation({
    mutationFn: (newFile : File) => fileService.saveFile(newFile),
    onSuccess: () => {
      // Isso faz a mágica: ele avisa ao useFiles que os dados antigos 
      // estragaram e força uma atualização automática!
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

// const createFileMutation = useCreateFile(); // Prepara a criação

// const handleSave = () => {
//   createFileMutation.mutate({ name: "Novo PDF", content: "..." });
// };

// -----------------------------------------------------------

export function useUpdateFile() {
  const queryClient = useQueryClient();

  interface MutationProps {
    fileId: string,
    updatedData?: File
  }

  return useMutation({
    // A função de mutação recebe os dados que você quer enviar
    mutationFn: ({fileId, updatedData} : MutationProps) => 
      fileService.updateFileById(fileId, updatedData),
    
    // O segredo está aqui: o que acontece após o sucesso
    onSuccess: (data, variables) => {
      // 1. Atualiza a lista geral de usuários no cache
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // 2. Se você tiver um cache específico para UM usuário, atualiza ele também
      queryClient.invalidateQueries({ queryKey: ['users', variables.fileId] });
      
      console.log("Usuário atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar:", error);
    }
  });
}

// const { mutate, isPending } = useUpdateUser();

// const handleSubmit = (dadosDoForm) => {
//   mutate({ 
//     userId: "123", 
//     updatedData: dadosDoForm 
//   });
// };

// -----------------------------------------------------------

// ----------------- Antigamente ------------------
// export function useFiles(fileId) {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchFiles = async () => {
//     setLoading(true);
//     try {
//       const data = await fileService.getAllFiles(fileId);
//       setFiles(data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { files, fetchFiles, loading };
// }