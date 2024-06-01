import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

// Replace this with your own Firebase project's configuration
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
