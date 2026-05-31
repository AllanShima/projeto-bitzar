import { DialogBackdrop, DialogPanel } from '@headlessui/react'
import React, { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";
import UserInput from '../../../ui/UserInput';
import type { User, File as IFile } from '@/interfaces/Interfaces';
import toast from 'react-hot-toast';
import { useNewFileActions } from '../hooks/useNewFileActions';

interface UploadFileProp {
    authUser: User,
    setFiles: Dispatch<SetStateAction<IFile[]>>,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const UploadFileModal = ({authUser, setFiles, setIsOpen} : UploadFileProp) => {
    const { handleNewFile, loading } = useNewFileActions();
    const [fileDescription, setFileDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);

    

    const handleClick = async () => {
        try {
            if (!fileDescription || !file) {
                throw new Error("Preencha o restante dos campo...");
            }

            const newFile: IFile = await handleNewFile(authUser, file, fileDescription);

            setFiles((prev) => [...prev, newFile]);

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
                    <fieldset className='space-y-4'>
                        <span className='flex flex-col space-y-1'>
                            <h2 className="font-medium text-purple-700 text-xl">
                                Upload de Arquivo PDF
                            </h2>
                            <p className='font-light text-sm'>
                                Faça upload de um novo documento PDF para o copiloto
                            </p>
                        </span>

                        {/* Caixa de Item */}
                        <div className={`relative flex flex-col items-center w-full h-fit 
                            ${!file && ('outline-2 outline-dashed outline-purple-300 hover:outline-purple-400 transition duration-200 rounded-2xl')}`}>

                            {!file ? (
                                <>
                                    <input 
                                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                    type="file" 
                                    accept='.pdf' 
                                    className='absolute hover:cursor-pointer w-full h-full text-transparent'/>
                                    <span className='flex w-full justify-center mt-10'>
                                        <MdOutlineFileUpload className='w-18 h-18 text-purple-400'/>
                                    </span>
                                    <p className='text-gray-800 text-sm'>
                                        Clique para selecionar ou arraste o arquivo aqui
                                    </p>
                                    <p className='font-light text-xs mb-10'>
                                        PDF até 10MB
                                    </p>                                
                                </>
                            ) : (
                                <iframe 
                                    src={URL.createObjectURL(file)} 
                                    className="w-full h-[400px]" 
                                    title="Visualizador de PDF"
                                />
                            )}

                        </div>
                        <div className='flex flex-col space-y-2'>
                            <label className='text-black font-medium'>
                                Descrição do documento
                            </label>
                            <div className='flex w-full h-9'>
                                <UserInput state={fileDescription} setState={setFileDescription} placeholder='Digite uma breve descrição...'/>                                
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
                                disabled={loading}
                                onClick={() => handleClick()}
                                className='bg-linear-to-r from-blue-400 to-fuchsia-400 hover:from-blue-500 hover:to-fuchsia-500 transition rounded-lg px-6 py-2 text-white font-medium'
                            >
                                {loading ? 'Carregando...' : 'Upload'}
                            </button>
                        </div>
                    </fieldset>

                </DialogPanel>
            </div>        
        </>
    )
}

export default UploadFileModal
