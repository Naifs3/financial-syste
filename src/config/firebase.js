import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDpzPCma5c4Tuxd5htRHOvm4aYLRbj8Qkg",
  authDomain: "financial-system-8f4b3.firebaseapp.com",
  projectId: "financial-system-8f4b3",
  storageBucket: "financial-system-8f4b3.firebasestorage.app",
  messagingSenderId: "243232571212",
  appId: "1:243232571212:web:d3c5bd06b09ef825d959e9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
