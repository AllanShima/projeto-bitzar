import { useDeleteMemberActions } from '@/features/members/hooks/useDeleteMemberActions'
import type { TeamMember, User } from '@/interfaces/Interfaces'
import { DialogBackdrop, DialogPanel } from '@headlessui/react'
import React, { type Dispatch, type SetStateAction } from 'react'
import toast from 'react-hot-toast'

interface UserDeleteModalProps {
    authUser: User,
    teamMembers: TeamMember[],
    setTeamMembers: Dispatch<SetStateAction<TeamMember[]>>,
    setIsOpen: Dispatch<SetStateAction<boolean>>
    toDeleteUser?: User
}

const UserDeleteModal = ({authUser, toDeleteUser, teamMembers, setTeamMembers, setIsOpen} : UserDeleteModalProps) => {
    const {handleDeleteMember, loading} = useDeleteMemberActions();
    console.log(teamMembers);
    const handleDelete = async () => {
        try {
            if (!toDeleteUser){
                throw new Error("Usuário não encontrado?...")
            }
            const updatedTeamMembers = await handleDeleteMember(authUser, toDeleteUser);
            setTeamMembers(updatedTeamMembers);
            
            toast.success(`Usuário ${toDeleteUser.firstName} apagado!`)
            setIsOpen(false);
        } catch (error) {
            toast.error(String(error));
        }
    }

    const userFullname = toDeleteUser?.firstName + " " + toDeleteUser?.lastName;

    return (
            <>
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50 text-black">
                    <DialogPanel transition className="relative transform overflow-hidden rounded-lg p-7 bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                        <fieldset className='space-y-2'>
                            <h2 className="font-medium text-red-700 text-xl">
                                Confirmar Exclusão
                            </h2>
                            <p className='font-light text-sm'>
                                Tem certeza que deseja retirar {userFullname} do grupo? Esta ação não pode ser desfeita.
                            </p>

                            <div className="flex gap-4 justify-end">
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className='bg-white hover:bg-gray-200 transition outline-1 outline-black/20 rounded-lg px-6 py-2'
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={loading}
                                    onClick={handleDelete}
                                    className='bg-red-500 hover:bg-red-600 transition rounded-lg px-6 py-2 text-white font-medium'
                                >
                                    {loading ? "Carregando..." : "Excluir"}
                                </button>
                            </div>
                        </fieldset>

                    </DialogPanel>
                </div>        
            </>
    )
}

export default UserDeleteModal
