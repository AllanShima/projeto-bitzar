import { useAuth } from '@/features/auth/AuthContext';
import React from 'react'
import toast from 'react-hot-toast';
import { Navigate } from 'react-router';

interface ProtectedRouteProp {
    children: React.ReactNode
}

// Um componente que segura outros componentes (através do children)
const ProtectedRoute = ({children} : ProtectedRouteProp) => {
  const { user, loading } = useAuth(); // Dados do contexto de autenticação

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    toast.error("Você precisa estar logado para ver esta página!");
    return <Navigate to="/login" replace/>;
  }

  return <>{children}</>;
};

export default ProtectedRoute
