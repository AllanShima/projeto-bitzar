import type { Message } from '@/interfaces/Interfaces'
import React from 'react'
import CircleIcon from './CircleIcon'
import ReactMarkdown from 'react-markdown';
import { handleTimeFormat } from '@/features/chat/utils/useFormatarHorarioActions';

interface MessageProps {
  message: Message
}

const MessageUI = ({message} : MessageProps) => {

  const handleBubbleStyle = (role : string) => {
    return role === "user" 
    ? "bg-linear-to-r from-blue-500 to-blue-600 text-white" 
    : "bg-linear-to-r from-blue-50 to-fuchsia-50 outline-1 outline-gray-200 text-black";
  }

  return (
    <div className={`flex max-w-230 h-fit gap-3 ${message.role == "user" ? "justify-start flex-row-reverse ml-auto" : "justify-start"}`}>
      <span className='flex w-9 h-9'>
        <CircleIcon role={message.role}/>
      </span>
      <div className={`flex flex-col gap-1 p-3 rounded-lg max-w-200 ${handleBubbleStyle(message.role)}`}>
        <div className='w-full h-full wrap-normal'>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <p className='text-gray-400 text-xs font-light'>
          {handleTimeFormat(message.createdAt)}
        </p>
      </div>         
    </div>
  )
}

export default MessageUI
