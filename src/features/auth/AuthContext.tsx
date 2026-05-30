import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useUsers } from '@/hooks/usersQuery';
import type { Team, User } from '@/interfaces/Interfaces';
import { useTeams } from '@/hooks/teamQuery';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: userData, isLoading: isLoadingUsers } = useUsers();
  const { data: teamData, isLoading: isLoadingTeams } = useTeams();

  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Escuta se o usuário está logado no Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFbUser(firebaseUser);
      if (!firebaseUser) {
        setUser(null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. ✅ APENAS MONTA O USUÁRIO NA MEMÓRIA (Sem loops de gravação no banco!)
  useEffect(() => {
    if (
        isLoadingUsers || 
        isLoadingTeams || 
        !userData || 
        !teamData || 
        !Array.isArray(userData) || 
        !Array.isArray(teamData)
      ) {
        return; // Aguarda os dados assentarem pacificamente no cache
      }

    if (fbUser) {
      const foundUser = userData?.find((u) => u.id === fbUser.uid);
      
      if (foundUser) {
        // Buscamos o time em tempo real direto da coleção 'teams' ativa do React Query
        const liveTeam = teamData?.find((t) => t.id === foundUser.teamLoggedIn?.id);

        if (liveTeam) {
          // Criamos o time dinamicamente com a data limpa apenas para a renderização
          const updatedTeam: Team = {
            ...liveTeam,
            createdAt: liveTeam.createdAt
          };

          // Injeta na memória o usuário contendo o time 100% atualizado e sem delay
          setUser({
            ...foundUser,
            teamLoggedIn: updatedTeam
          });
        } else {
          // Caso ele não tenha time associado, garante que fique null
          setUser({
            ...foundUser,
            teamLoggedIn: null
          });
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    }
  }, [userData, teamData, fbUser, isLoadingUsers, isLoadingTeams]);

  return (
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