import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useUsers } from '@/hooks/usersQuery';
import type { User } from '@/interfaces/Interfaces';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading: isLoadingUsers, isFetching } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  
  // Criamos um estado de carregamento próprio para o Auth
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Se o Firebase respondeu que NÃO há usuário logado
      if (!firebaseUser) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      // Se há usuário no Firebase, mas a lista do banco ainda está carregando,
      // mantemos o authLoading como true e esperamos o próximo ciclo.
      if (isLoadingUsers || isFetching || !data) {
        setAuthLoading(true);
        return;
      }

      // Se temos o usuário do Firebase E os dados do banco, finalmente cruzamos as informações
      const userId = firebaseUser.uid;
      const foundUser = data.find((u) => u.id === userId);
      
      setUser(foundUser || null);
      setAuthLoading(false); // Agora sim, terminamos de processar tudo!
    });

    return () => unsubscribe();
  }, [data, isLoadingUsers, isFetching]); // Adicionado isLoadingUsers nas dependências

  return (
    // Passamos o authLoading em vez do isLoading bruto do useUsers
    <AuthContext.Provider value={{ user, loading: authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}