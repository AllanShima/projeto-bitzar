import NewUserModal from '@/ui/NewUserModal'
import UploadFileModal from '@/ui/UploadFileModal'
import UserCard from '@/ui/UserCard'
import UserInput from '@/ui/UserInput'
import { Dialog } from '@headlessui/react'
import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { IoSearch } from 'react-icons/io5'
import { Teams, Users } from '@/assets/MockupData';
import type { Team, User } from '@/interfaces/Interfaces'
import { FaUserPlus } from 'react-icons/fa'
import NewMemberModal from '@/features/members/components/NewMemberModal'

interface TeamPageProps {
  authUser: User
}

const TeamPage = ({authUser}: TeamPageProps) => {
  // mockup
  // const [team, setTeam] = useState<Team>(Teams[0]!);

  // Se não tem time, deixa como vazio...
  const teamLoggedIn = !authUser?.teamLoggedIn ? {} as Team : authUser.teamLoggedIn;
  const [team, setTeam] = useState<Team>(teamLoggedIn);
  const teamMembers = !team?.members ? [] : team.members;

  const [newMemberModal, setNewMemberModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <div className='flex flex-col w-full h-full overflow-hidden bg-transparent pb-7'>
      {/* Upload and File Search Container */}
      <div className='w-full h-fit pt-7 px-7 mb-3'>
        <div className='flex flex-col justify-between w-full h-fit space-y-8 p-5 mb-4 rounded-2xl bg-white shadow-lg'>
          {/* Title */}
          <div className='flex w-full h-fit justify-between'>
            {/* Title */}
            <div className='flex flex-col'>
              <h2 className='font-bold bg-linear-to-r from-sky-600 to-fuchsia-600 text-transparent bg-clip-text text-2xl'>
                Gerenciamento do Grupo
              </h2>
              <p className='font-normal text-gray-500'>
                Gerencie os os usuários atuais de seu grupo
              </p>
            </div>
            {/* Upload Button */}
            <button 
              onClick={() => setNewMemberModal(true)}
              className='flex w-fit h-fit px-4 py-2 bg-linear-to-r from-sky-500 to-fuchsia-500 rounded-xl hover:from-sky-600 hover:to-fuchsia-600 transition duration-200'>
              <span className='flex justify-center items-center space-x-3'>
                <span>
                  <FaUserPlus className='w-4.5 h-4.5 my-auto'/>
                </span>
                <p className='font-medium text-white'>
                  Novo Usuário
                </p>
              </span>
            </button>
          </div>
          {/* Search Bar */}
          <div className='flex w-full h-10'>
            <UserInput state={searchText} setState={setSearchText} placeholder="Pesquisar membros..." Icon={IoSearch}/>  
          </div>
        </div>        
      </div>

      <div className='flex flex-col w-full h-full bg-transparent overflow-y-auto'>
        <div className='flex flex-col w-full h-full px-7'>
          {teamMembers.map((teammate) => (
            <div key={teammate.user?.id}>
              <UserCard teammate={teammate}/>              
            </div>
          ))}
          {/* Spacer */}
          <span className='flex w-full h-10 p-2 bg-transparent'/>
        </div>
      </div>
      <Dialog open={newMemberModal} onClose={() => setNewMemberModal(false)}>
        <NewMemberModal teamId={teamLoggedIn.id} setIsOpen={setNewMemberModal}/>
      </Dialog>

      <Toaster/>
    </div>
  )
}

export default TeamPage
