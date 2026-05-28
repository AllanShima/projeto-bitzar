import React from 'react'
import { Toaster } from 'react-hot-toast';
import TeamRegisterForm from '../components/TeamRegisterForm';
import TeamLoginForm from '../components/TeamLoginForm';

const TeamSelectionPage = () => {

  return (
    <div className='flex gap-3 w-full h-full bg-linear-to-bl from-fuchsia-500 to-sky-500 items-center justify-center'>
      {/* Enter group Container */}
      <TeamLoginForm/>
      {/* Register new group Container */}
      <TeamRegisterForm/>
      <Toaster/>
    </div>
  )
}

export default TeamSelectionPage
