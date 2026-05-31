import React, { useState, type Dispatch, type SetStateAction } from 'react'
import { Dialog, DialogBackdrop } from '@headlessui/react'
import { IoDocumentTextOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { CgTrash } from "react-icons/cg";
import FileSettingsModal from './FileSettingsModal';
import FileDeleteModal from './FileDeleteModal';
import toast from 'react-hot-toast';
import type { File, User } from '@/interfaces/Interfaces';
import { handleDateFormat } from '@/features/members/utils/useFormatarDataActions';

interface FileCardProps {
    authUser: User,
    file: File,
    setFiles: Dispatch<SetStateAction<File[]>>
}

const FileCard = ({authUser, file, setFiles} : FileCardProps) => {
    const [fileSettingsModal, setFileSettingsModal] = useState(false);
    const [fileDeleteModal, setFileDeleteModal] = useState(false);

    const handleDownload = () => {
        // toast.promise(
        //     saveSettings(settings),
        //     {
        //         loading: 'Saving...',
        //         success: <b>Settings saved!</b>,
        //         error: <b>Could not save.</b>,
        //     }
        // );
        toast.success("Arquivo instalado com sucesso!");
    }

    const fileSize = `${file.fileSize! / 1000} Kb`

    return (
        <div className='flex w-full h-fit rounded-2xl p-5 mb-7 justify-between bg-white hover:shadow-lg transition'>
            {/* Image/Icon */}
            <span className='flex space-x-4 items-center'>
                <div className='flex w-fit h-fit p-3 rounded-2xl bg-linear-to-r from-sky-100 to-fuchsia-100'>
                    <span className='w-fit h-fit'>
                        <IoDocumentTextOutline className='w-10 h-10 text-fuchsia-700'/>
                    </span>
                </div>
                {/* Main info */}
                <div className='flex flex-col w-fit h-fit text-black space-y-2'>
                    <h2 className='font-medium text-xl'>{file.name}</h2>
                    <p className='text-gray-800'>{file.description}</p>
                    <span className='flex items-center space-x-4 text-gray-600 text-xs'>
                        <p>Tamanho: {fileSize}</p>
                        <GoDotFill className='w-1.5 h-1.5'/>
                        <p>Criado em: {handleDateFormat(file.createdAt)}</p>
                    </span>
                </div>            
            </span>

            <div className='flex space-x-2'>

                <a 
                href={file.fileAddress} 
                download={file.name} 
                target="_blank" 
                rel="noopener noreferrer"
                className='w-fit h-fit p-1.5 rounded-md hover:bg-blue-50 transition duration-200'
                >
                    <MdOutlineFileDownload className='w-5 h-5 text-blue-700'/>
                </a>

                <button
                    onClick={() => setFileSettingsModal(true)}
                    className='w-fit h-fit p-1.5 rounded-md hover:bg-fuchsia-50 transition duration-200'
                >
                    <MdOutlineEdit className='w-5 h-5 text-fuchsia-700'/>
                </button>

                <button 
                    onClick={() => setFileDeleteModal(true)}
                    className='w-fit h-fit p-1.5 rounded-md hover:bg-red-50 transition duration-200'
                >
                    <CgTrash className='w-5 h-5 text-red-700'/>
                </button>
                
            </div>
            <Dialog open={fileSettingsModal} onClose={() => setFileSettingsModal(false)}>
                <FileSettingsModal authUser={authUser} file={file} setFiles={setFiles} setIsOpen={setFileSettingsModal}/>
            </Dialog>
            <Dialog open={fileDeleteModal} onClose={() => setFileDeleteModal(false)}>
                <FileDeleteModal authUser={authUser} file={file} setFiles={setFiles} setIsOpen={setFileDeleteModal}/>
            </Dialog>
        </div>
    )
}

export default FileCard
