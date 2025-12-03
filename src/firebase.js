// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBASp-eDHaNIMWQIj-ao3DXOMgyT1c4gKs",
  authDomain: "react-auth-app-710f1.firebaseapp.com",
  projectId: "react-auth-app-710f1",
  storageBucket: "react-auth-app-710f1.firebasestorage.app",
  messagingSenderId: "420066187070",
  appId: "1:420066187070:web:c1b7ef4f0cb6123984fe6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);