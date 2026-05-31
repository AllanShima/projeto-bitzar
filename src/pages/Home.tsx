import ChatPage from "@/features/chat/pages/ChatPage";
import ArchivePage from "../features/archives/pages/ArchivePage";
import HomeHeader from "./HomeHeader";
import { useAuth } from "@/features/auth/AuthContext";
import { useState } from "react";
import TeamInfoPage from '../features/members/pages/TeamPage';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

const Home = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('chat');

    if (loading) {
        return <div className="flex items-center justify-center h-screen w-screen text-black">Carregando usuário e grupo...</div>;
    }

    // se o usuário não estiver carregado
    if (!loading && !user) {
        return toast.error("Usuário não carregado...")
    }

    if (!loading && !user?.teamLoggedIn) {
        return toast.error("Time/Grupo não carregado...")
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
            <Toaster/>
        </div>
    );
};

export default Home