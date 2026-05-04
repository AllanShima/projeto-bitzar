import React, { useEffect, useState } from 'react'
import HomeHeader from './HomeHeader';
import ChatPage from './ChatPage';
import ArchivePage from './ArchivePage';
import TeamInfoPage from './TeamPage';

const Home = () => {
    const [activeTab, setActiveTab] = useState('chat');

    return (
        <div className="flex flex-col w-screen h-screen">
            <HomeHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
            
            <main className="flex-1 overflow-hidden relative">
                {/* Todas já estão renderizadas, porém, escondidas com css */}
                <div className={`flex flex-col w-full h-full ${activeTab !== 'chat' && 'hidden'}`}>
                    <ChatPage />
                </div>
                
                <div className={`flex flex-col w-full h-full ${activeTab !== 'archive' && 'hidden'}`}>
                    <ArchivePage />
                </div>
                
                <div className={`flex flex-col w-full h-full ${activeTab !== 'info' && 'hidden'}`}>
                    <TeamInfoPage />
                </div>
            </main>
        </div>
    )
}

export default Home
