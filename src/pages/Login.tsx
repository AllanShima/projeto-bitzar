import { auth } from '@/config/firebase';
import UserInput from '@/ui/UserInput'
import UserInputLabel from '@/ui/UserInputLabel';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, type SubmitEvent } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { FaUser } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { useNavigate } from 'react-router';

const Login = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e : SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, userEmail, userPassword);
            toast.success("Usuário logado com sucesso!");
            navigate("/teamregister");
        } catch (error){
            if (error instanceof FirebaseError) {
                // Aqui o TS sabe que 'error' tem as propriedades 'code' e 'message' (do proprio Firebase)
                toast.error(error.message);
            } else {
                // Trata erros que não são do Firebase (ex: erro de rede genérico)
                toast.error("Ocorreu um erro inesperado");
            }
        } finally{
            setLoading(false);
        }
    }
    return (
        <div className='flex w-full h-full bg-linear-to-bl from-fuchsia-500 to-sky-500 items-center justify-center'>
            {/* Login Container */}
            <div className='flex flex-col w-100 h-fit p-10 bg-white rounded-2xl'>
                <fieldset className='flex flex-col w-full items-center space-y-30'>
                    <form 
                        onSubmit={handleLogin}
                        className='flex flex-col w-full items-center space-y-6'>
                            
                        <h1 className='w-fit font-bold text-black text-2xl'>
                            Login
                        </h1>
                        <UserInputLabel state={userEmail} setState={setUserEmail} placeholder='Digite seu email...' Icon={FaUser} label='Email'/>
                        <UserInputLabel state={userPassword} setState={setUserPassword} placeholder='Digite sua senha...' Icon={FaUnlockAlt} label='Senha'/>
                        <button 
                        type='submit'
                        disabled={loading}
                        className='flex justify-center w-full h-fit py-2 text-white font-medium bg-linear-to-r from-blue-400 to-fuchsia-400 hover:from-blue-500 hover:to-fuchsia-500 transition disabled:opacity-50 rounded-full'>
                            {loading ? "Carregando..." : "Entrar"}
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
            <Toaster/>
        </div>
    )
}

export default Login
