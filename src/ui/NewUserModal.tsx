import { DialogBackdrop, DialogPanel } from '@headlessui/react';
import React, { useState, type Dispatch, type SetStateAction } from 'react'
import UserInput from './UserInput';
import { FaUserPlus } from 'react-icons/fa';

interface NewUserModalProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const NewUserModal = ({setIsOpen}: NewUserModalProps) => {
    const [userEmail, setUserEmail] = useState('');

    const [loading, setLoading] = useState(false);

    const handleNewUser = () => {
        // Adicionar novo arquivo
        setIsOpen(false);
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
                                
                            </h2>
                            <p className='font-light text-sm'>
                                Faça upload de um novo documento PDF para o copiloto
                            </p>
                        </span>
                        <div className='flex flex-col space-y-2'>
                            <label className='text-black font-medium'>
                                Email do usuário
                            </label>
                            <div className='flex w-full h-9'>
                                <UserInput state={userEmail} setState={setUserEmail} placeholder='Digite o email do usuário...'/>                                
                            </div>                        
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className='bg-white hover:bg-gray-200 transition outline-1 outline-black/20 rounded-lg px-6 py-2'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleNewUser()}
                                className='bg-linear-to-r from-blue-400 to-fuchsia-400 hover:from-blue-500 hover:to-fuchsia-500 transition rounded-lg px-6 py-2 text-white font-medium'
                            >
                                Upload
                            </button>
                        </div>
                    </fieldset>
                </DialogPanel>
            </div>        
        </>
    )
}
export default NewUserModal
