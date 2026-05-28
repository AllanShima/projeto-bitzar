import type { User } from '@/interfaces/Interfaces';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc } from 'firebase/firestore';

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
const userRef = collection(db, "users");

export const userService = {

// Criar/Salvar novo usuário
  async saveUser(userData: User) {
    try {
      if (!userData.id) {
        throw new Error("Não é possível salvar o usuário sem um ID de autenticação válido.");
      }
      const newDocRef = doc(db, 'users', userData.id);
      
      const userPayload = {
        id: userData.id, // id gerado pelo firebase auth
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        messages: [],
        teamLoggedIn: {},
        createdAt: new Date()
      };

      await setDoc(newDocRef, userPayload);
      return userPayload;
    } catch (error) {
      throw error;
    }
  },

  async getAllUsers() {
    try {
      // We pass the collection reference directly
      const snapshot = await getDocs(userRef);
      
      // Map through all documents found
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as User & { id: string }));
      
    } catch (error) {
      throw error;
    }
  },

  // Leitura do arquivo por id
  async getUserById(userId : string) {
    const q = query(userRef, where("id", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateUserById(userId: string, newUserData: Partial<User>) {

    try {
      if (!userId) {
        throw new Error("O userId veio vazio ou undefined!");
      }

      const userRef = doc(db, 'users', userId);
      // Diagnóstico 2: Tentar rodar o update
      await updateDoc(userRef, newUserData);
      return true;
    } catch (error) {
      // 🔥 ISSO AQUI VAI TE DIZER O MOTIVO REAL
      console.error("Erro CRÍTICO dentro do updateUserById:", error);
      throw error; 
    }
  },

  async deleteUserById(userId : string) {

  },
};