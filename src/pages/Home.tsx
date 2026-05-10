import React, { useEffect, useState } from 'react'
import HomeHeader from './HomeHeader';
import ChatPage from './ChatPage';
import ArchivePage from './ArchivePage';
import TeamInfoPage from './TeamPage';
import { useUserProfile } from '@/hooks/useUsers';
import { useAuth } from '@/features/auth/AuthContext';
import { useTeam } from '@/hooks/useTeam';

const Home = () => {
    const [activeTab, setActiveTab] = useState('chat');

    // Chamada do seu hook personalizado
    // const { data, isLoading, error, isError } = useUserProfile();

    // if (isLoading) {
    //     return <div>Carregando perfil...</div>;
    // }

    // if (isError) {
    //     return <div>Erro ao carregar: {error.message}</div>;
    // }

    // if (!data) {
    //     return <div>Nenhum dado encontrado para este usuário.</div>;
    // }

    const { user, loading } = useAuth(); // Dados do usuário autenticado
    // Everything goes inside one single object {}
    const stringUID = user?.uid.toString();
    const { data, isLoading, error } = useTeam(stringUID);

    useEffect(() => {
        console.log(data);
    }, [])
 
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
