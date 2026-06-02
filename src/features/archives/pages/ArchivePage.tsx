import React, { useEffect, useState } from 'react'
import { MdOutlineUploadFile } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import FileCard from '@/features/archives/ui/FileCard';
import UserInput from '@/ui/UserInput';
import { Dialog } from '@headlessui/react';
import UploadFileModal from '@/features/archives/ui/UploadFileModal';
import toast, { Toaster } from 'react-hot-toast';
import { DiVim } from 'react-icons/di';
import { Files } from '@/assets/MockupData';
import type { File, User } from '@/interfaces/Interfaces';

interface ArchivePageProps {
  authUser: User
}

const ArchivePage = ({authUser}: ArchivePageProps) => {

  // import { useQuery } from '@tanstack/react-query';

  // function ArchivePage() {
  //   // 'files' is the key for caching. 
  //   // fetchFiles is just your standard fetch() function.
  //   const { data, isLoading, error } = useQuery({ 
  //     queryKey: ['files'], 
  //     queryFn: fetchFiles 
  //   });

  //   if (isLoading) return <div>Loading...</div>;
  //   if (error) return <div>Error loading files!</div>;

  //   return (
  //     <div>
  //       {data.map(file => <FileCard key={file.id} file={file} />)}
  //     </div>
  //   );
  // }

  // dados mockup
  // const [files, setFiles] = useState<File[]>(Files);

  const filesFromTeamLoggedIn = !authUser?.teamLoggedIn?.files ? [] : authUser.teamLoggedIn.files;
  const [files, setFiles] = useState<File[]>(filesFromTeamLoggedIn);

  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Funcionalidade de procura
  useEffect(() => {
    if (searchText.trim() === "") {
      setFiles(filesFromTeamLoggedIn);
      return; // Para a execução aqui
    }

    // Filtra os arquivos ignorando maiúsculas/minúsculas
    const filteredFiles = filesFromTeamLoggedIn.filter((f) => {
      const fileName = f.name.toLowerCase();
      const search = searchText.toLowerCase();
      
      // Opção A: Começa com a(s) letra(s) digitada(s)
      return fileName.includes(search); 
      
      // Opção B: Se preferir que ache a letra em QUALQUER parte do nome, use:
      // return fileName.includes(search);
    });

    setFiles(filteredFiles);
  }, [searchText])

  return (
    <div className='flex flex-col w-full h-full overflow-hidden bg-transparent pb-7'>
      {/* Upload and File Search Container */}
      <div className='w-full h-fit pt-7 px-7 mb-3'>
        <div className='flex flex-col justify-between w-full h-fit space-y-8 p-5 mb-4 rounded-2xl bg-white shadow-lg'>
          {/* Title */}
          <div className='flex w-full h-fit justify-between'>
            {/* Title */}
            <div className='flex flex-col'>
              <h2 className='font-bold bg-linear-to-r from-sky-600 to-fuchsia-600 text-transparent bg-clip-text text-2xl'>
                Gerenciamento de Arquivos
              </h2>
              <p className='font-normal text-gray-500'>
                Gerencie os documentos PDF utilizados pelo copiloto
              </p>
            </div>
            {/* Upload Button */}
            <button 
              onClick={() => setUploadFileModal(true)}
              className='flex w-fit h-fit px-4 py-2 bg-linear-to-r from-sky-500 to-fuchsia-500 rounded-xl hover:from-sky-600 hover:to-fuchsia-600 transition duration-200'>
              <span className='flex justify-center items-center space-x-3'>
                <span>
                  <MdOutlineUploadFile className='w-4.5 h-4.5 my-auto'/>
                </span>
                <p className='font-medium text-white'>
                  Upload PDF
                </p>
              </span>
            </button>
          </div>
          {/* Search Bar */}
          <div className='flex w-full h-10'>
            <UserInput state={searchText} setState={setSearchText} placeholder="Pesquisar arquivos..." Icon={IoSearch}/>  
          </div>
        </div>        
      </div>

      <div className='flex flex-col w-full h-full bg-transparent overflow-y-auto'>
        <div className='flex flex-col w-full h-full px-7'>
          {files.map((file) => (
            <div key={file.id}>
              <FileCard authUser={authUser} file={file} setFiles={setFiles}/>
            </div>
          ))}
          {/* Spacer */}
          <span className='flex w-full h-10 p-2 bg-transparent'/>
        </div>
      </div>

      <Dialog open={uploadFileModal} onClose={() => setUploadFileModal(false)}>
        <UploadFileModal authUser={authUser} setFiles={setFiles} setIsOpen={setUploadFileModal}/>
      </Dialog>

      <Toaster/>
    </div>
  )
}

export default ArchivePage
