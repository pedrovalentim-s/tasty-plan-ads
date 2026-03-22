import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLAVLziQNN5W4DAOxvJHUyIAkwDJt_ViI",
  authDomain: "studio-9874340960-ecdd6.firebaseapp.com",
  projectId: "studio-9874340960-ecdd6",
  storageBucket: "studio-9874340960-ecdd6.firebasestorage.app",
  messagingSenderId: "782242074515",
  appId: "1:782242074515:web:346cf84e45965f77ec2266",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };
