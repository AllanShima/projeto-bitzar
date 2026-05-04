import React, { type Dispatch, type SetStateAction } from 'react'
import { NavLink } from 'react-router';
import type { IconType } from "react-icons";

interface TabButtonProps {
    onClick: () => void, // Função
    isActive: boolean,
    activeColor: string;
    label: string;
    Icon: IconType;
    size?: string
}

const TabButton = ({onClick, isActive, activeColor, label, Icon, size} : TabButtonProps) => {

    const getTabStyle = (isActive: boolean) =>  // Retorna automaticamente
            isActive 
            ? `bg-white ${activeColor} shadow-lg` 
            : "text-white hover:bg-purple-400 hover:text-black";

    return (
        <button onClick={onClick}>
            <div className={`flex items-center w-full h-full rounded-xl p-3 transition font-medium cursor-default border-none ${getTabStyle(isActive)}`}>
                <span className={`flex space-x-4 ${size === null ? "w-4.5 h-4.5" : `${size}`}`}>
                    <Icon className='w-full h-full'/>
                    <p className='font-normal'>
                        {label}
                    </p>
                </span>
            </div>
        </button>        
    )
}

export default TabButton
