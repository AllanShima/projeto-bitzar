// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQhwC6PXqmo9pi1aZQaUkDvb_jVxgVQPs",
  authDomain: "bitzar-docpilot.firebaseapp.com",
  projectId: "bitzar-docpilot",
  storageBucket: "bitzar-docpilot.firebasestorage.app",
  messagingSenderId: "514317362995",
  appId: "1:514317362995:web:d07476e13d18d5b509c046"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  // firebase config 
const auth = getAuth(app);                  // firebase authentication
const db = getFirestore(app);               // firebase firestore db
const storage = getStorage(app);            // firebase storage

export {app, auth, db, storage}