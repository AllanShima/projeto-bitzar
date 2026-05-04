import React, { useState, type Dispatch, type SetStateAction } from 'react'
import { DialogBackdrop, DialogPanel } from '@headlessui/react'
import UserInput from './UserInput'
import type { File } from '@/interfaces/Interfaces'
import toast from 'react-hot-toast'

interface FileModalProp {
    file: File,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const FileSettingsModal = ({file, setIsOpen} : FileModalProp) => {
    const [fileName, setFileName] = useState('');
    const [fileDesctiption, setFileDescription] = useState('');

    const handleNewFile = () => {
        toast.success("Novo arquivo inserido!");
        setIsOpen(false)
    }

    return (
        <>
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50 text-black">
                <DialogPanel transition className="relative transform overflow-hidden rounded-lg p-7 bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                    <fieldset className='space-y-2'>
                        <h2 className="font-medium text-purple-700 text-xl">
                            Editar Arquivo
                        </h2>
                        <p className='font-light text-sm'>
                            Atualize as informações do arquivo
                        </p>
                        {/* Input de usuários */}
                        <div className='flex flex-col w-full h-fit py-6 space-y-2 '>
                            <label className='text-black font-medium'>
                                Nome do Arquivo
                            </label>
                            <div className='flex w-full h-9'>
                                <UserInput state={fileName} setState={setFileName} placeholder={file.name}/>                                
                            </div>
                            <label className='text-black font-medium'>
                                Descrição
                            </label>
                            <div className='flex w-full h-9'>
                                <UserInput state={fileDesctiption} setState={setFileDescription} placeholder={file.description}/>                                
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className='bg-white hover:bg-gray-200 transition outline-1 font-semibold outline-black/20 rounded-lg px-6 py-2'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleNewFile}
                                className='bg-linear-to-r from-blue-400 to-fuchsia-400 hover:from-blue-500 hover:to-fuchsia-500 transition rounded-lg px-6 py-2 text-white font-medium'
                            >
                                Salvar
                            </button>
                        </div>
                    </fieldset>
                </DialogPanel>
            </div>        
        </>
    )
}

export default FileSettingsModal
