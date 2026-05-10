import type { ifError } from 'firebase/firestore/lite/pipelines';
import React from 'react'
import { RiRobot2Line } from "react-icons/ri";

interface CircleIconProps {
    role: 'user' | 'ai'
}

const CircleIcon = ({role} : CircleIconProps) => {

    // Requesição do usuário autenticado pra pegar o nome e sobrenome
    // const firstInitial = firstName?.[0] || '';
    // const lastInitial = lastName?.[0] || '';
    const firstInitial = 'a';
    const lastInitial = 's';

    const abbreviation = (firstInitial + lastInitial).toUpperCase();

    const isItUser = role === "user" ? true : false;

    // Se tiver vazio, é robo, contrario é user
    const handleStyle = isItUser ? "bg-linear-to-br from-blue-600 to-blue-700" : "bg-linear-to-r from-purple-600 to-purple-700";
    
    return (
        <div className={`flex w-full h-full justify-center items-center rounded-full text-white p-2 ${handleStyle}`}>
            {isItUser ? (abbreviation) : (<RiRobot2Line className='w-full h-full'/>)}
        </div>
    )
}

export default CircleIcon
