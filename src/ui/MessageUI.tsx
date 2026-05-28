import type { Message } from '@/interfaces/Interfaces'
import React from 'react'
import CircleIcon from './CircleIcon'
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: Message
}

const MessageUI = ({message} : MessageProps) => {

  const handleCreationDate = (msg: Message) => {
    if (!msg.createdAt) return "00:00";

    let date: Date;

    // 1. Checa se o objeto de data possui o método '.toDate' vindo do Firebase Timestamp
    if (typeof (msg.createdAt as any).toDate === 'function') {
      date = (msg.createdAt as any).toDate();
    } 
    // 2. Se já for uma instância de Date nativa do JavaScript
    else if (msg.createdAt instanceof Date) {
      date = msg.createdAt;
    } 
    // 3. Caso seja uma string ou qualquer outra estrutura de data válida
    else {
      date = new Date(msg.createdAt as any);
    }

    // Agora que garantimos que 'date' é um objeto Date nativo, formatamos as horas com segurança!
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };

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
          {handleCreationDate(message)}
        </p>
      </div>         
    </div>
  )
}

export default MessageUI
