import React from 'react'
import { MdOutlineGroupAdd } from 'react-icons/md'
import { useNavigate } from 'react-router'

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col w-full h-full'>
      {/* Landing page Header */}
      <div className='flex w-full h-30 min-h-20 py-5 px-10 items-center bg-white shadow-lg'>
        <nav className='flex w-full h-full'>
          <div className='flex w-full h-full justify-between items-center'>
            <div className='flex w-fit h-full gap-3'>
              {/* Logo */}
              <div className='flex w-fit h-full items-center px-4 bg-white rounded-xl shadow-md'>
                <h1 className='bg-linear-to-r from-sky-500 to-fuchsia-500 inline-block text-transparent bg-clip-text text-2xl font-bold'>
                  DocPilot
                </h1>
              </div>                  
            </div>

            <span className='flex gap-4'>
              {/* User Type indicator */}
              <div className='flex w-fit h-fit gap-2 my-auto'>
                {/* Chat Tab button */}
                {/* <UserStatusTag teamMember={}/> */}
              </div>
              {/* Leave button */}
              <div className='flex w-fit h-3/4 gap-1 my-auto'>
                {/* Chat Tab button*/}
                <button onClick={() => {navigate("/login")}} className='flex my-auto h-fit w-fit px-3 py-1 rounded-xl hover:bg-blue-100 transition text-blue-500'>
                  <MdOutlineGroupAdd className='my-auto mr-2 w-5 h-5'/>
                  Entrar/Logar
                </button>
                <button onClick={() => {navigate("/register")}} className='flex my-auto h-fit w-fit px-3 py-1 rounded-xl hover:bg-purple-200 transition text-purple-500'>
                  <MdOutlineGroupAdd className='my-auto mr-2 w-5 h-5'/>
                  Cadastrar
                </button>
              </div>                    
            </span>
          </div>
        </nav>
      </div>

      {/* Landing page Body */}
      <div className='flex flex-col justify-center items-center w-full h-full bg-lwhite'>
        <span className='flex gap-2 w-fit h-fit justify-center items-center'>
          <h1 className='bg-linear-to-r from-sky-700 to-fuchsia-700 inline-block text-transparent bg-clip-text text-3xl font-bold'>
            Prototipo: 
          </h1>
          <h1 className='bg-linear-to-r from-sky-500 to-fuchsia-500 inline-block text-transparent bg-clip-text text-3xl font-bold'>
            Plataforma Copiloto Chatbot para Desenvolvedores
          </h1>          
        </span>

      </div>

    </div>

  )
}

export default LandingPage
