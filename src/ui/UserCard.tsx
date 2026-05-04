import { Dialog } from '@headlessui/react';
import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { CgTrash } from 'react-icons/cg';
import { MdOutlineEdit } from 'react-icons/md';
import { GoDotFill } from 'react-icons/go';
import { IoDocumentTextOutline } from 'react-icons/io5';
import type { TeamMember, User } from '@/interfaces/Interfaces';
import UserSettingsModal from './UserSettingsModal';
import UserDeleteModal from './UserDeleteModal';

interface UserCardProps {
    teammate?: TeamMember
}

const UserCard = ({teammate} : UserCardProps) => {
    const [userSettingsModal, setUserSettingsModal] = useState(false);
    const [userDeleteModal, setUserDeleteModal] = useState(false);

    const user = teammate?.user;

    const statusCapitalized = teammate?.status == "admin" ? "Administrador" : "Participante";

    const username = user?.firstName + " " + user?.lastName;

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
                    <h2 className='font-medium text-xl'>{username}</h2>
                    <p className='text-gray-800'>{user?.email}</p>
                    <span className='flex items-center space-x-4 text-gray-600 text-xs'>
                        <p>Cadastrado em: {user?.createdAt}</p>
                        <GoDotFill className='w-1.5 h-1.5'/>
                        <p>{statusCapitalized}</p>
                    </span>
                </div>            
            </span>

            <div className='flex space-x-2'>
                <button
                    onClick={() => setUserSettingsModal(true)}
                    className='w-fit h-fit p-1.5 rounded-md hover:bg-fuchsia-50 transition duration-200'
                >
                    <MdOutlineEdit className='w-5 h-5 text-fuchsia-700'/>
                </button>

                <button 
                    onClick={() => setUserDeleteModal(true)}
                    className='w-fit h-fit p-1.5 rounded-md hover:bg-red-50 transition duration-200'
                >
                    <CgTrash className='w-5 h-5 text-red-700'/>
                </button>
                
            </div>
            <Dialog open={userSettingsModal} onClose={() => setUserSettingsModal(false)}>
                <UserSettingsModal user={user} setIsOpen={setUserSettingsModal}/>
            </Dialog>
            <Dialog open={userDeleteModal} onClose={() => setUserDeleteModal(false)}>
                <UserDeleteModal user={user} setIsOpen={setUserDeleteModal}/>
            </Dialog>

            <Toaster/>
        </div>
    )
}

export default UserCard
