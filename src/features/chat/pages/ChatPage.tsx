import React, { useEffect, useState, type FormEvent } from 'react';
import { RiRobot3Line } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";
import toast, { Toaster } from 'react-hot-toast';
import ChatBody from '@/features/chat/components/ChatBody';
import type { Message, User } from '@/interfaces/Interfaces';
import { HiDotsHorizontal } from "react-icons/hi";
import { useTextSubmitActions } from '../hooks/useTextSubmitActions';

interface ChatPageProps {
  authUser: User;
}

const ChatPage = ({ authUser }: ChatPageProps) => {
  const [userText, setUserText] = useState("");
  const [containsText, setContainsText] = useState(false);

  // Inicializa o estado com as mensagens que já existem no banco
  const [messages, setMessages] = useState<Message[]>(authUser.messages || []);

  const { handleTextSubmit, loading: loadingResponse, handleUpdate, model } = useTextSubmitActions(authUser.id!);

  useEffect(() => {
    if (messages.length === 0) {
      const starterAIMessage: Message = {
        role: 'ai',
        content: "Olá, como eu posso te ajudar?",
        createdAt: new Date(),
      };
      setMessages([starterAIMessage]);
      handleUpdate(starterAIMessage); // Salva a inicial no banco
    }
  }, []); // Executa apenas uma vez ao montar o componente

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userText.trim()) return;

    // Otimismo visual: Adiciona a mensagem do usuário na tela na hora
    const temporaryUserMessage: Message = {
      role: 'user',
      content: userText,
      createdAt: new Date()
    };
    
    setMessages((prev) => [...prev, temporaryUserMessage]);
    setUserText("");
    setContainsText(false);

    try {
      const result = await handleTextSubmit(userText);
      
      if (result) {
        // Adiciona a resposta da IA na tela (a do usuário já adicionamos acima)
        setMessages((prev) => [...prev, result.newAIMessage]);
      }
    } catch (error: unknown) {
      toast.error(String(error));
    }
  };

  const getButtonStyle = (isActive: boolean) =>
    isActive
      ? "bg-linear-to-r from-sky-300 to-fuchsia-300 hover:from-sky-400 hover:to-fuchsia-400 transition"
      : "bg-linear-to-r from-sky-200 to-fuchsia-200 transition cursor-not-allowed";

  return (
    <div className='flex flex-col w-full h-full p-10 bg-transparent'>
      <div className='flex flex-col flex-1 w-full h-full rounded-2xl bg-white shadow-lg'>
        {/* Header interno */}
        <div className='w-full h-fit flex flex-col gap-1 bg-linear-to-r from-sky-500 to-fuchsia-500 p-5 rounded-t-2xl text-white'>
          <span className='flex gap-2 items-center'>
            <RiRobot3Line className='w-7 h-7'/>
            <h2 className='font-normal text-2xl'>
              DocPilot: Seu co-piloto de acesso fácil a dados empresariais!
            </h2>
          </span>
          <p className='font-light opacity-90'>
            Modelo de IA Generativa: {model}
          </p>
        </div>

        {/* Corpo Interno */}
        <ChatBody messages={messages}/>

        {/* Footer Interno (Input do usuario) */}
        <form 
          onSubmit={handleSubmit}
          className='flex flex-col w-full h-fit p-4 gap-2 rounded-b-2xl bg-linear-to-r from-sky-50 to-fuchsia-50'>
          <span className='flex gap-3 items-center'>
            <textarea 
              value={userText}
              disabled={loadingResponse}
              onChange={(e) => {
                setUserText(e.target.value); 
                setContainsText(e.target.value.trim().length > 0);
              }} 
              placeholder='Digite sua mensagem... (Shift + Enter para uma nova linha)'
              className='resize-none flex flex-1 h-12 px-4 py-2 bg-gray-100 rounded-2xl text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-sky-400/50 transition'
            />
            
            <button 
              type='submit'
              disabled={loadingResponse || !containsText}
              className={`flex w-fit h-12 px-5 items-center justify-center rounded-2xl text-white ${getButtonStyle(containsText || loadingResponse)}`}>
              {loadingResponse ? <HiDotsHorizontal className='w-6 h-6 animate-pulse'/> : <IoIosSend className='w-6 h-6'/>}
            </button>            
          </span>

          <p className='text-gray-400 text-xs font-light'>
            O DocPilot utiliza os documentos PDF carregados para responder suas perguntas
          </p>
        </form>
      </div>
      <Toaster/>
    </div>
  );
};

export default ChatPage;