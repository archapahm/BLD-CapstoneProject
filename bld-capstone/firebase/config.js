import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import 'firebase/storage'
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9rWVPOmiNs9mElyyfwZFT2xfVWGwZ64Q",
  authDomain: "capstone-bld.firebaseapp.com",
  projectId: "capstone-bld",
  storageBucket: "capstone-bld.appspot.com",
  messagingSenderId: "461859628307",
  appId: "1:461859628307:web:cf0a7e14b22aebd41626e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initiliaze Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth();

const storage = getStorage();

export { db, auth, storage };