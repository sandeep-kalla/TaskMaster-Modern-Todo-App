import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase configuration object
  apiKey: "AIzaSyANSjQOX_XhG1ilaIcabRgIfeSj50aEPaQ",
  authDomain: "modern-todo-app-41f99.firebaseapp.com",
  projectId: "modern-todo-app-41f99",
  storageBucket: "modern-todo-app-41f99.appspot.com",
  messagingSenderId: "160173419022",
  appId: "1:160173419022:web:1cd3e1fcbbf5260901aa5f",
  measurementId: "G-VB6G7CCGHS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
