import React from 'react'
import CircleIcon from './CircleIcon'

const GeneratingResponseUI = () => {

    return (
        <>
            <span className='w-9 h-9'>
            <CircleIcon role={'ai'}/>
            </span>
            <div className={`flex flex-col gap-1 p-3 rounded-lg  bg-linear-to-r from-blue-50 to-fuchsia-50 outline-1 outline-gray-200 text-black`}>
            <p className='w-full h-full wrap-normal'>
                ...
            </p>
            </div>      
        </>
    
    )
}

export default GeneratingResponseUI
