import React, { type Dispatch, type SetStateAction } from 'react'
import TabButton from './TabButton'
import { FaUserFriends } from "react-icons/fa";
import { FaUsersCog } from "react-icons/fa";

interface UserInputButtonsProps {
    activeButton: string,
    setActiveButton: Dispatch<SetStateAction<any>>
}

const UserInputButtons = ({activeButton, setActiveButton} : UserInputButtonsProps) => {
  return (
    <div className='flex w-fit h-fit rounded-2xl p-2 gap-2 bg-linear-to-r from-purple-500 to-purple-700'>
        <TabButton 
            onClick={() => setActiveButton('admin')} 
            isActive={activeButton === 'admin'}
            activeColor="text-purple-500" 
            label="Administrador" 
            Icon={FaUsersCog}
            size='w-full h-3 text-xs'
        />
        <TabButton 
            onClick={() => setActiveButton('participant')} 
            isActive={activeButton === 'participant'}
            activeColor="text-fuchsia-500" 
            label="Participante" 
            Icon={FaUserFriends}
            size='w-full h-3 text-xs'
        />
    </div>
  )
}

export default UserInputButtons
