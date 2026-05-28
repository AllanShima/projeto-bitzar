import type { Team, TeamMember, User } from '@/interfaces/Interfaces';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

/**
 * @typedef {Object} Team
 * @property {string} id? - O ID único do firebase do time.
 * @property {string} title - Título do grupo
 * @property {string} description - Descrição do grupo
 * @property {string} code - Código da sala/grupo
 * @property {number} ownerId? - Id do usuário dono do grupo
 * @property {number} members? - Todos os membros do grupo menos o dono
 * @property {number} createdAt? - Data de criação do grupo
 */

// Referência da pasta
const teamRef = collection(db, 'teams');

export const teamService = {

  // Criar/Salvar time/grupo
  async saveTeam(teamData : Team) {
    // Gerando o Id
    const docRef = doc(teamRef);
    const documentId = docRef.id;

    const teamPayload = { 
      id: documentId, // ID "A"
      title: teamData.title,
      description: teamData.description,
      code: teamData.code,
      ownerId: teamData.ownerId,
      members: [],
      files: [],
      createdAt: new Date() 
    };
    await setDoc(docRef, teamPayload);

    return teamPayload;
  },

  // Leitura do arquivo por id do dono do grupo
  async getTeamByOwnerId(ownerId : string) {
    const q = query(teamRef, where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
  },

  // Leitura do arquivo por id do grupo
  async getTeamById(teamId : string) {
    const q = query(teamRef, where("id", "==", teamId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
  },

  // Leitura de todos os grupos disponíveis no banco
  async getAllTeams() {
    try {
      // We pass the collection reference directly
      const snapshot = await getDocs(teamRef);
      
      // Map through all documents found
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Team & { id: string }));
      
    } catch (error) {
      console.error("Error fetching all teams:", error);
      throw error;
    }
  },
  
  // async updateTeamByOwnerId(teamId : string,  newTeamData : Team) { // o usuário pode criar apenas um grupo
  //   const teams = await this.getTeamByOwnerId(ownerId); // retorna uma lista de times

  //   const teamId = teams[0]?.id;

  //   if (!teamId) {
  //     throw new Error("Time não encontrado.");
  //   }

  //   const teamDocRef = doc(db, 'teams', teamId)
  //   await updateDoc(teamDocRef, {
  //     title: newTeamData.title,
  //     description: newTeamData.description,
  //     code: newTeamData.code,
  //     members: newTeamData.members,
  //   });
  // },

  async updateTeamById(ownerId : string,  newTeamData : Partial<Team>) {
    const teams = await this.getTeamById(ownerId); // retorna uma lista de times

    const teamId = teams[0]?.id;

    try {
      if (!teamId) {
        throw new Error("Time não encontrado.");
      }

      const teamRef = doc(db, 'teams', teamId);

      await updateDoc(teamRef, newTeamData);
      return true;      
    } catch (error) {
      console.error("Erro CRÍTICO dentro do updateUserById:", error);
      throw error; 
    }
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