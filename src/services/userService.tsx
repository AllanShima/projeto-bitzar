import type { User } from '@/interfaces/Interfaces';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc } from 'firebase/firestore';

/**
 * @typedef {Object} User
 * @property {string} id? - O ID único do usuário no Firebase Auth.
 * @property {string} firstName - Primeiro nome.
 * @property {string} lastName - Sobrenome.
 * @property {string} email - Endereço de e-mail.
 * @property {number} password - Senha do usuário
 * @property {number} messages? - Todas as mensagens de conversa do usuário e o chatbot
 * @property {number} createdAt - Data de cadastro do usuário
 */

// Referência da pasta
const userRef = collection(db, 'teams', "users");

export const userService = {

  // Criar/Salvar novo usuário
  async setUser(userData : User) {
    // Gerando o Id
    const docRef = doc(userRef);
    const documentId = docRef.id;

    return await addDoc(userRef, 
      { 
        id: documentId, 
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        messages: [],
        createdAt: new Date()
      }
    );
  },

  // Leitura do arquivo por id
  async getUserById(userId : string) {
    const q = query(userRef, where("id", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateUserById(userId : string, newUserData : User) {

  },

  async deleteUserById(userId : string) {

  },
};