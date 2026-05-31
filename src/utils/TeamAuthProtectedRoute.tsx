import { useAuth } from '@/features/auth/AuthContext';
import type { Team } from '@/interfaces/Interfaces';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation } from 'react-router';

interface ProtectedRouteProp {
  children: React.ReactNode;
}

const TeamAuthProtectedRoute = ({ children }: ProtectedRouteProp) => {
    const { user, loading } = useAuth();

    // ✅ Captura o time temporário vindo direto do formulário (se existir)
    const storedTeam = JSON.parse(localStorage.getItem('logged_team')!);

    // O usuário tem permissão se ele já tem o time no Firebase OU se acabou de logar e o time está no state da rota
    const hasTeam = user?.teamLoggedIn || storedTeam;

    useEffect(() => {
        if (!loading && user && !hasTeam) {
            toast.error("Entre em um grupo/time para continuar!");
        }
    }, [user, loading, hasTeam]);

    if (loading) return <p>Carregando...</p>;
    
    if (!hasTeam) {
        return <Navigate to="/teamregister" replace />;
    }
    
    return <>{children}</>;
};

export default TeamAuthProtectedRoute;