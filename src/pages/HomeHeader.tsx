import React, { useEffect, useState, type Dispatch, type MouseEvent, type SetStateAction, type SubmitEvent } from 'react'
import { IoIosChatboxes } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";
import { CgEnter } from "react-icons/cg";
import { RiTeamFill } from "react-icons/ri";
import NavLinkTab from '@/ui/TabButton';
import { auth } from '@/config/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { MdExitToApp, MdOutlineGroupAdd } from "react-icons/md";
import TabButton from '@/ui/TabButton';
import UserStatusTag from '@/ui/UserStatusTag';
import type { Team, User } from '@/interfaces/Interfaces';
import { useUpdateUser } from '@/hooks/usersQuery';

interface HomeHeaderProps {
    authUser?: any
    activeTab: string,
    setActiveTab: Dispatch<SetStateAction<string>>
}

const HomeHeader = ({authUser, activeTab, setActiveTab} : HomeHeaderProps) => {
    const updateUserMutation = useUpdateUser();
    const navigate = useNavigate();
    const teamLoggedIn = authUser?.teamLoggedIn;

    const handleLogoutUser = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Opcional, mas evita comportamentos inesperados
        try {
            await signOut(auth);
            // onAuthStateChanged cuidaria do redirecionamente automaticamente
            navigate("/login");
        } catch (error) {
            toast.error(String(error));
        }
    };

    const handleLogoutGroup = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await handleUpdate(authUser.id);
            navigate('/teamregister')
        } catch (error) {
            toast.error(String(error));
        }
    }

    const handleUpdate = async (userId: string) => {
        updateUserMutation.mutate({
        id: userId,
        updatedData: { 
            teamLoggedIn: null,
        }
        });
    };

    return (
        <nav className='flex w-full h-20 min-h-20 max-h-20 py-2.5 px-10 items-center bg-linear-to-r from-sky-500 to-fuchsia-500 shadow-lg'>
            <div className='flex w-full h-full justify-between items-center'>
                <div className='flex w-fit h-full gap-3'>
                    {/* Logo */}
                    <div className='flex w-fit h-full items-center px-4 bg-white rounded-xl'>
                        <h1 className='bg-linear-to-r from-sky-500 to-fuchsia-500 inline-block text-transparent bg-clip-text text-3xl font-bold'>
                            DocPilot
                        </h1>
                    </div>

                    {/* Tab buttons */}
                    <div className='flex w-fit h-3/4 gap-2 my-auto'>
                        <TabButton 
                            onClick={() => setActiveTab('chat')} 
                            isActive={activeTab === 'chat'}
                            activeColor="text-sky-500" 
                            label="Chat" 
                            Icon={IoIosChatboxes}
                        />
                        <TabButton 
                            onClick={() => setActiveTab('archive')} 
                            isActive={activeTab === 'archive'}
                            activeColor="text-fuchsia-500" 
                            label="Arquivos" 
                            Icon={FaFileAlt}
                        />
                        <TabButton 
                            onClick={() => setActiveTab('info')} 
                            isActive={activeTab === 'info'}
                            activeColor="text-fuchsia-700" 
                            label="Configurações" 
                            Icon={RiTeamFill}
                        />
                    </div>                    
                </div>

                <span className='w-fit h-fit px-3 py-1 rounded-md bg-linear-to-r from-purple-500 to-purple-600 shadow-lg text-white'>
                    <p>{teamLoggedIn?.title}</p>
                </span>

                <span className='flex gap-4'>
                    {/* User Type indicator */}
                    <div className='flex w-fit h-fit gap-2 my-auto'>
                        {/* Chat Tab button */}
                        {/* <UserStatusTag teamMember={}/> */}
                    </div>
                    {/* Leave button */}
                    <div className='flex w-fit h-3/4 gap-1 my-auto'>
                        {/* Chat Tab button*/}
                        <button onClick={(e) => handleLogoutGroup(e)} className='flex my-auto h-fit w-fit px-3 py-1 rounded-xl hover:bg-fuchsia-600 transition'>
                            <MdOutlineGroupAdd className='my-auto mr-2 w-5 h-5'/>
                            Criar/Entrar Grupo
                        </button>
                        <button onClick={(e) => handleLogoutUser(e)} className='flex my-auto h-fit w-fit px-3 py-1 rounded-xl hover:bg-fuchsia-600 transition'>
                            <MdExitToApp className='my-auto mr-2 w-5 h-5'/>
                            Sair
                        </button>
                    </div>                    
                </span>
            </div>
            <Toaster/>
        </nav>
    )
}

export default HomeHeader
