import React, { useState, type Dispatch, type SetStateAction } from 'react'
import { DialogBackdrop, DialogPanel } from '@headlessui/react'
import toast from 'react-hot-toast'
import type { File, User } from '@/interfaces/Interfaces'
import { useDeleteFileActions } from '../hooks/useDeleteFileActions'

interface FileModalProp {
    authUser: User,
    setIsOpen: Dispatch<SetStateAction<boolean>>
    file: File,
    setFiles: Dispatch<SetStateAction<File[]>>
}

const FileDeleteModal = ({authUser, file, setFiles, setIsOpen} : FileModalProp) => {
    const { handleDeleteFile, loading } = useDeleteFileActions();
    const handleDelete = async () => {
        try {
            const updatedFiles = await handleDeleteFile(authUser, file);
            setFiles(updatedFiles);

            toast.success(`Arquivo ${file.name} apagado com sucesso!`)

            setIsOpen(false);
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
                    <fieldset className='space-y-2'>
                        <h2 className="font-medium text-red-700 text-xl">
                            Confirmar Exclusão
                        </h2>
                        <p className='font-light text-sm'>
                            Tem certeza que deseja excluir {file.name}? Esta ação não pode ser desfeita.
                        </p>

                        <div className="flex gap-4 justify-end">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className='bg-white hover:bg-gray-200 transition outline-1 outline-black/20 rounded-lg px-6 py-2'
                            >
                                Cancel
                            </button>
                            <button 
                                disabled={loading}
                                onClick={handleDelete}
                                className='bg-red-500 hover:bg-red-600 transition rounded-lg px-6 py-2 text-white font-medium'
                            >
                                {loading ? "Carregando..." : "Excluir"}
                            </button>
                        </div>
                    </fieldset>

                </DialogPanel>
            </div>        
        </>
    )
}

export default FileDeleteModal