import type { Message } from '@/interfaces/Interfaces'
import React, { useEffect } from 'react'
import CircleIcon from './CircleIcon'
import MessageUI from './MessageUI'
import { useGemini } from '@/features/chat/useGemini'
import GeneratingResponseUI from './GeneratingResponseUI'

interface ChatBodyProps {
    messages: Message[]
}

const ChatBody = ({messages} : ChatBodyProps) => {

    return (
        <div className='flex-1 flex flex-col w-full h-full overflow-y-auto p-4 space-y-4'>
            {messages.map((msg, index) => (
                <MessageUI key={index} message={msg}/>
            ))}    
        </div>
    )
}

export default ChatBody
