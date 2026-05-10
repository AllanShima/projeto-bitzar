import { useAuth } from '@/features/auth/AuthContext';
import { useCreateTeam, useTeam, useTeams } from '@/hooks/useTeam';
import type { TeamMember } from '@/interfaces/Interfaces';
import UserInputLabel from '@/ui/UserInputLabel';
import { FirebaseError } from 'firebase/app';
import React, { useState, type SubmitEvent } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { MdSubtitles, MdOutlinePassword } from "react-icons/md";
import { useNavigate } from 'react-router';
import GroupLoginForm from '../components/LoginForm';
import GroupRegisterForm from '../components/RegisterForm';
import LoginForm from '../components/RegisterForm';
import RegisterForm from '../components/RegisterForm';

const TeamSelectionPage = () => {

  return (
    <div className='flex gap-3 w-full h-full bg-linear-to-bl from-fuchsia-500 to-sky-500 items-center justify-center'>
      {/* Enter group Container */}
      <LoginForm/>
      {/* Register new group Container */}
      <RegisterForm/>
      <Toaster/>
    </div>
  )
}

export default TeamSelectionPage
