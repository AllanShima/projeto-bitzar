import type { Message, Team, User } from '@/interfaces/Interfaces';
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
        teamLoggedIn: null,
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
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt
      } as User & { id: string }));
      
    } catch (error) {
      throw error;
    }
  },

  async getUserByEmail(email: string) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const snapshot = await getDocs(q);
      
      // 1. Se estiver vazio ou se por algum motivo bizarro o array docs não existir
      if (snapshot.empty || !snapshot.docs || snapshot.docs.length === 0) {
        return null;
      }
      
      // 2. Pegamos o primeiro documento com segurança
      const firstDoc = snapshot.docs[0];

      // ✅ CORREÇÃO: Usamos uma checagem extra (ou encadeamento opcional) para garantir que o 'firstDoc' existe
      if (!firstDoc) return null;
      
      return { 
        id: firstDoc.id, 
        ...firstDoc.data() 
      } as User;

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
      
      await updateDoc(userRef, newUserData);
      return true;
    } catch (error) {
      console.error("Erro CRÍTICO dentro do updateUserById:", error);
      throw error; 
    }
  },

  async deleteUserById(userId : string) {

  },
};