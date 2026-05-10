import { auth } from '@/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState, type SubmitEvent } from 'react'
import { FaUnlockAlt, FaLock, FaUser } from "react-icons/fa";

import toast, { Toaster } from 'react-hot-toast';
import UserInputLabel from '@/ui/UserInputLabel';
import { useNavigate } from 'react-router';
import { FirebaseError } from 'firebase/app';
import { useCreateUser } from '@/hooks/useUsers';

const Register = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser(); // Prepara a criação

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPass: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name] : value}));
  }

  const handleSave = async () => {
    const { firstName, lastName, email, password } = formData;
    createUserMutation.mutate({ firstName: firstName, lastName: lastName, email: email, password: password });
  };

  const handleRegister = async (e : SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o reload da página

    const { email, password, confirmPass } = formData;

    if (Object.values(formData).some(field => field === '')) {
      return toast.error('Preencha todos os campos!');
    }

    if (password !== confirmPass) {
      return toast.error('As senhas não conferem!');
    }

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(auth, email, password);
      await handleSave(); // Salva os dados no banco

      toast.success('Seja bem-vindo!');
      navigate("/teamregister");
      
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Aqui o TS sabe que 'error' tem as propriedades 'code' e 'message'
        toast.error(error.message);
      } else {
        // Trata erros que não são do Firebase (ex: erro de rede genérico)
        toast.error("Ocorreu um erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex w-full h-full bg-linear-to-bl from-fuchsia-500 to-sky-500 items-center justify-center'>
        {/* Login Container */}
        <div className='flex flex-col w-200 h-fit p-10 bg-white rounded-2xl'>
            <div className='flex flex-col w-full items-center space-y-20'>
                <form onSubmit={handleRegister} className='flex flex-col w-full items-center space-y-6'>
                  <h1 className='w-fit font-bold text-black text-2xl'>
                    Cadastro
                  </h1>
                  {/* Grid dos inputs */}
                  <div className='w-full grid grid-cols-2 grid-rows-3 gap-4'>

                    {/* <UserInputLabel state={formData.userName} setState={(val) => handleChange("userName", val)} placeholder='Digite seu nome de usuário...' Icon={FaUser} label='Nome de usuário'/> */}
                    <UserInputLabel state={formData.email} setState={(y) => handleChange("email", y)} placeholder='Digite seu email...' Icon={FaUser} label='Email'/>
                    <UserInputLabel state={formData.firstName} setState={(y) => handleChange("firstName", y)} placeholder='Digite seu nome...' Icon={FaUser} label='Nome'/>
                    <UserInputLabel state={formData.lastName} setState={(y) => handleChange("lastName", y)} placeholder='Digite seu sobrenome...' Icon={FaUser} label='Sobrenome'/>
                    <UserInputLabel state={formData.password} setState={(y) => handleChange("password", y)} placeholder='Digite sua senha...' Icon={FaUnlockAlt} label='Senha'/>
                    <UserInputLabel state={formData.confirmPass} setState={(y) => handleChange("confirmPass", y)} placeholder='Digite sua senha novamente' Icon={FaLock} label='Digite a senha novamente'/>

                  </div>

                  <button 
                  type='submit'
                  disabled={loading}
                  className='flex justify-center w-1/2 h-fit py-2 text-white font-medium bg-linear-to-r from-blue-400 to-fuchsia-400 hover:from-blue-500 hover:to-fuchsia-500 transition disabled:opacity-50 rounded-full'>
                    {loading ? 'Carregando...' : 'Cadastrar'}
                  </button>                        
                </form>

                <div className='flex flex-col items-center'>
                    <p className='text-gray-600 font-light text-sm'>
                      Ou se já cadastrou
                    </p>
                    <a 
                      href="/login"
                      className='text-purple-900 font-semibold'
                    >
                      Entrar
                    </a>                        
                </div>
            </div>
        </div>
        <Toaster/>
    </div>
  )
}

export default Register
