import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { query, where, doc, setDoc, getDoc, addDoc, collection, getFirestore, getDocs } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyAMmfoa_zhCr2SWpNDv1Y0PndPow09zqQc",
    authDomain: "vpharmadatabase.firebaseapp.com",
    databaseURL: "https://vpharmadatabase-default-rtdb.firebaseio.com",
    projectId: "vpharmadatabase",
    storageBucket: "vpharmadatabase.appspot.com",
    messagingSenderId: "223466754303",
    appId: "1:223466754303:web:1ed9d91971424e9c977cca",
    measurementId: "G-J1SPR2JWK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

const currentUserID = "";
const currentUserType = "";

async function MakeRequest(){


}

async function DisplayPata(){
    
}
