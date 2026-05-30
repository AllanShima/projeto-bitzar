import ChatPage from "@/features/chat/pages/ChatPage";
import ArchivePage from "./ArchivePage";
import HomeHeader from "./HomeHeader";
import { useAuth } from "@/features/auth/AuthContext";
import { useState } from "react";
import TeamInfoPage from '../features/members/pages/TeamPage';

const Home = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('chat');

    if (loading) {
        return <div className="flex items-center justify-center h-screen w-screen">Carregando...</div>;
    }

    return (
        <div className="flex flex-col w-screen h-screen">
            <HomeHeader authUser={user} activeTab={activeTab} setActiveTab={setActiveTab}/>
            
            <main className="flex-1 overflow-hidden relative">
                <div className={`flex flex-col w-full h-full ${activeTab !== 'chat' && 'hidden'}`}>
                    <ChatPage authUser={user!}/>
                </div>
                
                <div className={`flex flex-col w-full h-full ${activeTab !== 'archive' && 'hidden'}`}>
                    <ArchivePage authUser={user!}/>
                </div>

                <div className={`flex flex-col w-full h-full ${activeTab !== 'info' && 'hidden'}`}>
                    <TeamInfoPage authUser={user!}/>
                </div>
            </main>
        </div>
    );
};

export default Home