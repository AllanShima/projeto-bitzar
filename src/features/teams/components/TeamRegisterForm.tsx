import UserInputLabel from '@/ui/UserInputLabel';
import React, { useState, type SubmitEvent } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { MdOutlinePassword, MdSubtitles } from 'react-icons/md';
import { useTeamRegisterActions } from '../hooks/useTeamRegisterActions';
import { useTeamLoginActions } from '../hooks/useTeamLoginActions';

const TeamRegisterForm = () => {
  const { handleTeamRegister } = useTeamRegisterActions();
  const { handleTeamLogin } = useTeamLoginActions();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    title: '',
    description: '',
    code: '',
  });

  const handleRegister = async (e : SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o reload da página

    if (Object.values(registerData).some(field => field === '')) {
      return toast.error('Preencha todos os campos!');
    }
    
    try {
      setLoading(true);
      await handleTeamRegister(registerData.title, registerData.description, registerData.code);
      toast.success("Criado com sucesso!");
    } catch (error){
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (name: string, value: string) => {
    setRegisterData(prev => ({...prev, [name] : value}));
  }

  return (
    <div className='flex flex-col w-100 h-fit p-10 bg-white rounded-2xl'>
      <fieldset className='flex flex-col w-full items-center space-y-30'>
        <form 
          onSubmit={handleRegister}
          className='flex flex-col w-full items-center space-y-6'>
          <h1 className='w-fit font-bold text-black text-2xl'>
              Criar Novo Gropo
          </h1>
          <UserInputLabel state={registerData.title} setState={(y) => handleChange("title", y)} placeholder='Digite o título...' Icon={MdSubtitles} label='Título'/>
          <UserInputLabel state={registerData.description} setState={(y) => handleChange("description", y)} placeholder='Digite a descrição...' Icon={MdSubtitles} label='Descrição'/>
          <UserInputLabel state={registerData.code} setState={(y) => handleChange("code", y)} placeholder='Digite o código de entrada...' Icon={MdOutlinePassword} label='Código/Senha'/>
          <button 
          type='submit'
          disabled={loading}
          className='flex justify-center w-full h-fit py-2 text-white font-medium bg-linear-to-r from-blue-400 to-fuchsia-400 hover:from-blue-500 hover:to-fuchsia-500 transition disabled:opacity-50 rounded-full'>
              {loading ? "Carregando..." : "Criar"}
          </button>                        
        </form>

        <div className='flex flex-col items-center'>
          <p className='text-gray-600 font-light text-sm'>
              Ou se não cadastrou ainda
          </p>
          <a 
            href="/register"
            className='text-purple-900 font-semibold'
          >
            Cadastrar
          </a>                        
        </div>
      </fieldset>
    </div>
  )
}

export default TeamRegisterForm
