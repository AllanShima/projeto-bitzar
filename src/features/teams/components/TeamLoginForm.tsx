import UserInputLabel from '@/ui/UserInputLabel';
import React, { useState, type SubmitEvent } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { MdOutlinePassword } from 'react-icons/md';
import { useTeamLoginActions } from '../hooks/useTeamLoginActions';
import { useNavigate } from 'react-router';
import type { User } from '@/interfaces/Interfaces';

interface LoginFormProps {
  authUser?: User | null
}

const TeamLoginForm = ({authUser} : LoginFormProps) => {
  const navigate = useNavigate();
  const { handleTeamLogin, loading } = useTeamLoginActions();
  const [enterCode, setEnterCode] = useState('');

  const handleLogin = async (e : SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o reload da página

    if (enterCode == '') {
      return toast.error("Preencha todos os campos!");
    }

    try {
      if (!authUser) {
        throw new Error("Falha ao carregar usuário!")
      }

      const loggedTeam = await handleTeamLogin(authUser, enterCode);
      navigate('/home', { state: { justLoggedInTeam: loggedTeam } });
      
    } catch (error) {
      toast.error(String(error))
    }
  }

  return (
    <div className='flex flex-col w-100 h-fit p-10 bg-white rounded-2xl'>
      <fieldset className='flex flex-col w-full items-center space-y-30'>
        <form 
          onSubmit={handleLogin}
          className='flex flex-col w-full items-center space-y-6'>
          <h1 className='w-fit font-bold text-black text-2xl'>
              Entrar em um Grupo
          </h1>
          <UserInputLabel state={enterCode} setState={setEnterCode} placeholder='Digite o código...' Icon={MdOutlinePassword} label='Código'/>
          <button 
          type='submit'
          disabled={loading}
          className='flex justify-center w-full h-fit py-2 text-white font-medium bg-linear-to-r from-blue-400 to-fuchsia-400 hover:from-blue-500 hover:to-fuchsia-500 transition disabled:opacity-50 rounded-full'>
            {loading ? "Carregando..." : "Entrar"}
          </button>                        
        </form>
      </fieldset>
      <Toaster/>
    </div>
  )
}

export default TeamLoginForm
