import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyDiAlmuWi1xphvIz57Wlf6ieO-kM3SG1A8",
    authDomain: "king-258f8.firebaseapp.com",
    projectId: "king-258f8",
    storageBucket: "king-258f8.appspot.com",
    messagingSenderId: "515245331588",
    appId: "1:515245331588:web:7d92711b4896a2451cded1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);