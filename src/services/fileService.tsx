import type { File } from '@/interfaces/Interfaces';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { doc } from 'firebase/firestore/lite';

// Comentários pra gerar documento em JSDoc
/**
 * Retrieves a user by email.
 * @async
 * @param {string} email - The user's email address.
 * @returns {User} The user object.
 * @throws {NotFoundError} If the user is not found.
*/

// Referência da pasta
const fileRef = collection(db, 'teams', "files");

export const fileService = {

  // Criar/Salvar novo arquivo
  async saveFile(fileData : File) {
    // Gerando o Id
    const docRef = doc(fileRef);
    const documentId = docRef.id;

    return await addDoc(fileRef, 
        { 
          id: documentId, 
          fileData: fileData, 
          createdAt: new Date() 
        }
    );
  },

  // Leitura do arquivo por id
  async getFileById(fileId : string) {
    const q = query(fileRef, where("id", "==", fileId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // Leitura de Todos os arquivos
  async getAllFiles() {

  },

  async updateFileById(fileId : string, updatedData? : File) {

  },

  async deleteFileById(fileId : string) {

  }
};