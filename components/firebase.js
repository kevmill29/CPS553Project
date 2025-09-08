// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth"
import 'firebase/firestore';
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_vrf7U6tMsmmHhsF7-Fcc4mLQORjTgYk",
  authDomain: "accord-7dbd3.firebaseapp.com",
  projectId: "accord-7dbd3",
  storageBucket: "accord-7dbd3.appspot.com",
  messagingSenderId: "39483246809",
  appId: "1:39483246809:web:44638169e80189ba4956c8",
  measurementId: "G-CYCZLGY59X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export {auth, provider};
export default db;