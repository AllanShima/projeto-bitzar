import React, { useEffect, useState, type FormEvent, type SubmitEvent } from 'react'
import { RiRobot3Line } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";
import toast, { Toaster } from 'react-hot-toast';
import ChatBody from '@/ui/ChatBody';
import type { Message } from '@/interfaces/Interfaces';
import { useGemini } from '@/features/chat/useGemini';
import { HiDotsHorizontal } from "react-icons/hi";
import { useOllama } from '@/features/chat/useOllama';
import { useGroq } from '@/features/chat/useGroq';

const ChatPage = () => {
  const { generate, loading, model } = useGroq();

  const [userText, setUserText] = useState("");
  const [containsText, setContainsText] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Olá, como eu posso te ajudar?",
      createdAt: new Date()
    }
  ]);

  const handleTextSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // impede refresh da página

    // Requesição Post para enviar novo texto no chat

    // Limpando o input e adicionando a mensagem
    const newUserMessage: Message = {
      role: 'user',
      content: userText,
      createdAt: new Date()
    }
    setMessages((prev) => [...prev, newUserMessage]);
    const tempUserText = userText;
    setUserText("");
    setLoadingResponse(true);

    try {
      // Gera a resposta da IA e retorna
      const aiResponse = await generate(tempUserText);

      const newAIMessage: Message = {
        role: 'ai',
        content: aiResponse!,
        createdAt: new Date()
      }
      setMessages((prev) => [...prev, newAIMessage]);
      // Salvando a mensagem do usuário no banco somente se resposta der certo
      // postChatMessage(newUserMessage);
      // postChatMessage(newAiResponse);

    } catch (error : unknown){
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoadingResponse(false);
      setContainsText(false);
    }
  }

  const getButtonStyle = (isActive: boolean) =>
          isActive 
          ? "bg-linear-to-r from-sky-300 to-fuchsia-300 hover:bg-linear-to-r hover:from-sky-400 hover:to-fuchsia-400 transition"
          : "bg-linear-to-r from-sky-200 to-fuchsia-200 transition";

  return (
    <div className='flex flex-col w-full h-full p-10 bg-transparent'>
      <div className='flex flex-col flex-1 w-full h-full rounded-2xl bg-white shadow-lg'>
        {/* Header interno */}
        <div className='w-full h-fit flex flex-col gap-1 bg-linear-to-r from-sky-500 to-fuchsia-500 p-5 rounded-t-2xl'>
          <span className='flex gap-2'>
            <RiRobot3Line className='w-7 h-7'/>
            <h2 className='font-normal text-2xl'>
              DocPilot: Seu co-piloto de acesso fácil a dados empresariais!
            </h2>
          </span>
          <p className='font-light'>
            Modelo de IA Generativa: {model}
          </p>
        </div>
        {/* Corpo Interno */}
        <ChatBody messages={messages}/>
        {/* Footer Interno (Input do usuario) */}
        <form 
          onSubmit={handleTextSubmit}
          className='flex flex-col w-full h-fit p-4 gap-2 rounded-b-2xl bg-linear-to-r from-sky-50 to-fuchsia-50'>
          <span className='flex gap-3'>
            <textarea 
              value={userText}
              onChange={(e) => {
                setUserText(e.target.value); 
                if (e.target.value.length > 0 && !(e.target.value.trim() == "")) {
                  setContainsText(true);
                } else setContainsText(false);
              }} 
              placeholder='Digite sua mensagem... (Shift + Enter para uma nova linha)'
              className='resize-none flex w-full h-full px-4 py-2 bg-gray-100 rounded-2xl text-black placeholder-gray-400 outline-1 outline-gray-300 focus:outline-3 focus:outline-gray-400/60 transition'/>
            {/* Botão de enviar mensagem */}
            <button 
              type='submit'
              disabled={loadingResponse || !containsText}
              className={`flex w-fit h-full p-4 items-center justify-center rounded-2xl ${getButtonStyle((containsText) || (loadingResponse))}`}>
              {loadingResponse ? (<HiDotsHorizontal className='w-6 h-6'/>) : (<IoIosSend className='w-6 h-6'/>)}
            </button>            
          </span>

          <p className='text-gray-500 text-xs font-light'>
            O DocPilot utiliza os documentos PDF carregados para responder suas perguntas
          </p>
        </form>
      </div>
      <Toaster/>
    </div>
  )
}

export default ChatPage
