import { DialogBackdrop, DialogPanel } from '@headlessui/react'
import React, { useState, type Dispatch, type SetStateAction, type SubmitEvent } from 'react'
import UserInput from '../../../ui/UserInput'
import toast from 'react-hot-toast'
import { useNewMemberActions } from '../hooks/useNewMemberActions'
import type { User } from '@/interfaces/Interfaces'
import { useQueryClient } from '@tanstack/react-query'

interface NewMemberProp {
    authUser: User,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const NewMemberModal = ({authUser, setIsOpen} : NewMemberProp) => {
    const { handleNewMember, loading } = useNewMemberActions();
    const [userEmail, setUserEmail] = useState('');
    const queryClient = useQueryClient();

    const handleClick = async () => {
        try {
            const team = authUser?.teamLoggedIn;
            if (!team) {
                throw new Error("Nenhum time/grupo encontrado??");
            }
            await handleNewMember(team, userEmail);

            // 👈 3. CORREÇÃO: Invalida a query que traz os dados do usuário autenticado.
            // Substitua 'authUser' pela chave exata que você usou no hook do seu perfil/auth
            await queryClient.invalidateQueries({ queryKey: ['users'] });

            setIsOpen(false)
        } catch (error) {
            toast.error(String(error));
        } 
    }
    return (
        <>
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50 text-black">
                <DialogPanel transition className="relative transform overflow-hidden rounded-lg p-7 bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                    <fieldset className='space-y-4'>
                        <span className='flex flex-col space-y-1'>
                            <h2 className="font-medium text-purple-700 text-xl">
                                Adicionar novo usuário ao grupo
                            </h2>
                            <p className='font-light text-sm'>
                                Adicione o Email de um usuário já cadastrado
                            </p>
                        </span>
                        <div className='flex flex-col space-y-2'>
                            <label className='text-black font-medium'>
                                Email do usuário
                            </label>
                            <div className='flex w-full h-9'>
                                <UserInput state={userEmail} setState={setUserEmail} placeholder='Digite o Email do usuário...'/>                                
                            </div>                        
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button 
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className='bg-white hover:bg-gray-200 transition outline-1 outline-black/20 rounded-lg px-6 py-2'
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button"
                                disabled={loading}
                                onClick={() => handleClick()}
                                className='w-40 bg-linear-to-r from-blue-400 to-fuchsia-400 hover:from-blue-500 hover:to-fuchsia-500 transition rounded-lg px-6 py-2 text-white font-medium'
                            >
                                {loading ? "Carregando..." : "Criar"}
                            </button>
                        </div>
                    </fieldset>

                </DialogPanel>
            </div>        
        </>
    )
}

export default NewMemberModal
