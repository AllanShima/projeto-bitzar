import type { User } from '@/interfaces/Interfaces'
import { DialogBackdrop, DialogPanel } from '@headlessui/react'
import React, { useState, type Dispatch, type SetStateAction } from 'react'
import UserInput from './UserInput'
import UserInputButtons from './UserInputButtons'

interface UserSettingsModalProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    user?: User
}

const UserSettingsModal = ({user, setIsOpen} : UserSettingsModalProps) => {

  const [userPermission, setUserPermission] = useState('participant');

  const handleUserUpdate = () => {
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
                Permissão do Usuário
              </h2>
              <p className='font-light text-sm'>
                Administrador = Consegue fazer upload de documentos. Participante = Somente usar o chat
              </p>
            </span>
            <div className='flex flex-col w-full space-y-2 items-center'>
              <div className='flex w-fit'>
                <UserInputButtons activeButton={userPermission} setActiveButton={setUserPermission}/>               
              </div>                        
            </div>

            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className='bg-white hover:bg-gray-200 transition outline-1 outline-black/20 rounded-lg px-6 py-2'
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleUserUpdate()}
                className='bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition rounded-lg px-6 py-2 text-white font-medium'
              >
                Atualizar
              </button>
            </div>
          </fieldset>
        </DialogPanel>
      </div>        
    </>
  )
}

export default UserSettingsModal
