import type { Team, TeamMember, User } from '@/interfaces/Interfaces';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

/**
 * @typedef {Object} Team
 * @property {string} id - O ID único do usuário no Firebase Auth.
 * @property {string} firstName - Primeiro nome.
 * @property {string} lastName - Sobrenome.
 * @property {string} email - Endereço de e-mail.
 * @property {number} code - Código da sala/grupo
 * @property {number} members - Todos os membros do grupo menos o dono
 * @property {number} createdAt - Data de criação do grupo
 */

// Referência da pasta
const teamRef = collection(db, 'teams');

export const teamService = {

  // Criar/Salvar novo usuário
  async setTeam(teamData : Team) {
    // Gerando o Id
    const docRef = doc(teamRef);
    const documentId = docRef.id;

    return await addDoc(teamRef, 
      { 
        id: documentId, 
        teamData: teamData,
        createdAt: new Date() 
      }
    );
  },

  // Leitura do arquivo por id do dono do grupo
  async getTeamByOwnerId(ownerId : string) {
    const q = query(teamRef, where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team & { id: string }));
  },
  
  async updateTeamByOwnerId(ownerId : string,  newTeamData : Team) { // o usuário pode criar apenas um grupo
    const teams = await this.getTeamByOwnerId(ownerId); // retorna uma lista de times

    const teamId = teams[0]?.id;

    if (!teamId) {
      throw new Error("Time não encontrado.");
    }

    const teamDocRef = doc(db, 'teams', teamId)
    await updateDoc(teamDocRef, {
      title: newTeamData.title,
      description: newTeamData.description,
      code: newTeamData.code,
      members: newTeamData.members,
    });
  },

  async updateStatusByOwnerId(ownerId : string, targetUserId : string, newStatus: 'admin' | 'participant') {
    const teamDocRef = doc(db, 'teams', ownerId);
    const teamSnap = await getDoc(teamDocRef);

    if (!teamSnap.exists()) {
      throw new Error("Time não encontrado.");
    }

    const teamData = teamSnap.data() as Team;

    // 1. Create a NEW array based on the old one
    const updatedMembers = teamData.members?.map((member) => {
      // If this is the user we want to change, return a new object with the new status
      if (member.user?.id === targetUserId) {
        return { ...member, status: newStatus };
      }
      // Otherwise, return the member exactly as they were
      return member;
    });

    // 2. Save the entire updated array back to Firestore
    await updateDoc(teamDocRef, {
      members: updatedMembers
    });
  },

  async deleteTeamByOwnerId(ownerId : string) {
    const docRef = doc(db, "teams", ownerId); 
    await deleteDoc(docRef);
  }
};