import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider , signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBhR3Aub70uWO389cx9APgfBIjXHDLje9c",
    authDomain: "vastufy-58bac.firebaseapp.com",
    projectId: "vastufy-58bac",
    storageBucket: "vastufy-58bac.appspot.com",
    messagingSenderId: "93318804866",
    appId: "1:93318804866:web:8ece5edf21c4ed1ad60b9b",
    measurementId: "G-NHXGV8ER1Q"
  };


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  export { auth , provider , signInWithPopup }