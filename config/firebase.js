// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import * as firebase from "firebase/compat/app"
import { initializeFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDV_RoCcsCXh4bI2j_jnGh9orLpM-nQ-cU",
  authDomain: "codecrafters-f7606.firebaseapp.com",
  projectId: "codecrafters-f7606",
  storageBucket: "codecrafters-f7606.appspot.com",
  messagingSenderId: "772567513029",
  appId: "1:772567513029:web:4e8219fa55500bb2583dac"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
// export const db = getFirestore(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
