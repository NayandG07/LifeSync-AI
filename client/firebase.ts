import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "A1zaSyGWStA98e9j5jThI4-7X16n8oH-phWkDI",
  authDomain: "lifesync-3202e.firebaseapp.com",
  projectId: "lifesync-3202e",
  storageBucket: "lifesync-3202e.firebasestorage.app",
  messagingSenderId: "740137400429",
  appId: "1:740137400429:web:d5c9b89d8cd9cb82cb2764",
  measurementId: "G-LKPVTVAL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);

// Get Firestore instance
export const db = getFirestore(app);

export default app; 