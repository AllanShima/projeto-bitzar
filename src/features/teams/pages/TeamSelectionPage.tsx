import React from 'react'
import { Toaster } from 'react-hot-toast';
import TeamRegisterForm from '../components/TeamRegisterForm';
import TeamLoginForm from '../components/TeamLoginForm';
import { useAuth } from '@/features/auth/AuthContext';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router';

const TeamSelectionPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div>
        Carregando...
      </div>
    )
  }
  return (
    <div className='flex w-full h-full bg-linear-to-bl from-fuchsia-500 to-sky-500'>
      <div className='fixed w-fit h-fit p-7'>
        <button 
        onClick={() => navigate('/login')}
        className='flex w-fit h-fit px-5 py-2 rounded-lg items-center justify-center gap-3 hover:bg-purple-500 hover:text-black transition'>
          <FaArrowLeft/>
          Voltar
        </button>
      </div>
      <div className='flex gap-3 w-full h-full items-center justify-center'>
        {/* Enter group Container */}
        <TeamLoginForm authUser={user}/>
        {/* Register new group Container */}
        <TeamRegisterForm authUser={user}/>
      </div>
      <Toaster/>
    </div>
  )
}

export default TeamSelectionPage
