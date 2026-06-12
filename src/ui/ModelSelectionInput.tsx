import React, { type Dispatch, type SetStateAction } from 'react'
import TabButton from './TabButton'
import { FaUserFriends } from "react-icons/fa";
import { FaUsersCog } from "react-icons/fa";

interface ModelSelectionInputProps {
    activeButton: string,
    setActiveButton: Dispatch<SetStateAction<any>>
}

const ModelSelectionInput = ({activeButton, setActiveButton} : ModelSelectionInputProps) => {
  return (
    <div className='flex w-fit h-10 rounded-2xl p-2 gap-2 bg-linear-to-r from-blue-500 to-blue-600'>
        <TabButton 
            onClick={() => setActiveButton('ollama')} 
            isActive={activeButton === 'ollama'}
            activeColor="text-blue-500" 
            label="Ollama" 
            Icon={FaUsersCog}
            size='w-full h-3 text-xs'
        />
        <TabButton 
            onClick={() => setActiveButton('gemini')} 
            isActive={activeButton === 'gemini'}
            activeColor="text-blue-700" 
            label="Gemini" 
            Icon={FaUserFriends}
            size='w-full h-3 text-xs'
        />
    </div>
  )
}

export default ModelSelectionInput
