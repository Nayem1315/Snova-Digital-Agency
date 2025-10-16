// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDYR6XZMwuHBZonZTcI6kBSbb3rdF1zulg",
  authDomain: "snova-digital-agency.firebaseapp.com",
  projectId: "snova-digital-agency",
  storageBucket: "snova-digital-agency.firebasestorage.app",
  messagingSenderId: "995469742839",
  appId: "1:995469742839:web:3e434e855fbd4eb946b9f2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);