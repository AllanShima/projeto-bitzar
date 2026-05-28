import { useAuth } from '@/features/auth/AuthContext';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router';

interface ProtectedRouteProp {
  children: React.ReactNode;
}

const UserAuthProtectedRoute = ({ children }: ProtectedRouteProp) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      toast.error("Você precisa estar logado para ver esta página!");
    }
  }, [user, loading]);

  // 1. Primeiro, espera o Firebase e a Query terminarem de carregar
  if (loading) return <p>Carregando...</p>;

  // 2. ✅ CORRETO: Se parou de carregar e o usuário AINDA é nulo, manda pro login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se achou o usuário, libera o acesso
  return <>{children}</>;
};

export default UserAuthProtectedRoute;