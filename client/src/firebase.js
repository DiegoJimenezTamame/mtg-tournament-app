// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Add this line

const firebaseConfig = {
    apiKey: "AIzaSyCjqlIvWmszIaMSNhq1ea23HlLURPHlYtA",
    authDomain: "mtg-tournament-app.firebaseapp.com",
    projectId: "mtg-tournament-app",
    storageBucket: "mtg-tournament-app.appspot.com",
    messagingSenderId: "916529608917",
    appId: "1:916529608917:web:13efa6b046e0bd49e58a5c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Export Firestore instance
