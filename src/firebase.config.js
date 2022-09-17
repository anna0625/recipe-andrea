// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoAs7M_Radhk3PzBhcbH__eIqp1rMUD6g",
  authDomain: "recipe-andrea-app.firebaseapp.com",
  projectId: "recipe-andrea-app",
  storageBucket: "recipe-andrea-app.appspot.com",
  messagingSenderId: "690442064295",
  appId: "1:690442064295:web:3c2def65a7d9993ce06682",
  measurementId: "G-FT3W9P2M7T",
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore();
