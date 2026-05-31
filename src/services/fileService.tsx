import type { File } from '@/interfaces/Interfaces';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore/lite';

// Comentários pra gerar documento em JSDoc
/**
 * @typedef {Object} File
 * @property {string} id? - O ID único do firestore.
 * @property {string} name - Nome do arquivo.
 * @property {string} description - Descrição do arquivo.
 * @property {string} fileAddress - Endereço do arquivo armazenado em firebase Storage
 * @property {number} fileSize - Tamanho do arquivo em memória
 * @property {number} uploadedBy - Usuário que criou o arquivo
 * @property {number} createdAt - Data de criação do arquivo
 */

// Referência da pasta
const teamRef = collection(db, 'teams');

export const fileService = {

  // Criar/Salvar novo arquivo
  async saveFile(fileData : File) {
    // Gerando o Id

    const docRef = doc(teamRef);
    const documentId = docRef.id;

    return await addDoc(fileRef, 
      { 
        id: documentId, 
        fileData: fileData, 
        createdAt: new Date() 
      }
    );
  },

  // Leitura de todos os arquivos
  async getFilesByTeamId(teamId : string) {
    const teamDocRef = doc(db, 'teams', teamId);
    const teamSnap = await getDoc(teamDocRef);

    if (teamSnap.exists()) {
      const teamData = teamSnap.data();
      const files = teamData.files || []; // Aqui estão seus arquivos!
      return files;
    }
  },

  async updateFileById(teamId: string, fileId : string, updatedData? : File) {
    const teamDocRef = doc(db, 'teams', teamId);
    const teamSnap = await getDoc(teamDocRef);

    if (teamSnap.exists()) {
      const teamData = teamSnap.data();
      const files = teamData.files || []; // Aqui estão seus arquivos!
      return files;
    }
  },

  async deleteFileById(fileId : string) {
    const docRef = doc(db, "teams", fileId); 
    await deleteDoc(docRef);
  }
};