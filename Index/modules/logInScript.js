import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import {  doc, setDoc, getDoc, addDoc, collection, getFirestore, getDocs } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

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
const app=initializeApp(firebaseConfig);
const db=getFirestore();

//login initial info
document.getElementById("pacientLogIn").style.display="none";
document.getElementById("pharmaLogIn").style.display="none";
document.getElementById("loginButton").style.display="none";
document.getElementById("PacientPage").style.display = "none";
document.getElementById("PharmacistPage").style.display = "none";
var isPacient=false;

async function GetPacients() {
    const pacientRef = collection(db, 'pacients');
    const snapshot = await getDocs(pacientRef);
    const result = snapshot.docs.map(doc => doc.data());
    console.log(result);
    return JSON.parse(result);
}
async function GetMedicine() {
    const medRef = collection(db, "medications");
    const snapshot = await getDocs(medRef);
    const result = snapshot.docs.map(doc => doc.data());
    return JSON.parse(result);
}
async function GetPharmacist() {
    const pharmacistRef = collection(db, "pharmacists");
    const snapshot = await getDocs(pharmacistRef);
    const result = snapshot.docs.map(doc => doc.data());
    return JSON.parse(result);
}

document.getElementById("loginButton").onclick=
function LogIn() {

    if(isPacient)
    {
        document.getElementById("PacientPage").style.display = "block";
    }
    else
    {
        document.getElementById("PharmacistPage").style.display = "block";
    }
    document.getElementById("login").style.display = "none";
}
document.getElementById("pButton").onclick=
function pacientOption() {
    document.getElementById("pacientLogIn").style.display = "block";
    document.getElementById("pharmaLogIn").style.display = "none";
    document.getElementById("loginButton").style.display = "block";
    isPacient=true;
};
document.getElementById("phButton").onclick=
function pharmaOption() {
    document.getElementById("pacientLogIn").style.display = "none";
    document.getElementById("pharmaLogIn").style.display = "block";
    document.getElementById("loginButton").style.display = "block";
    isPacient=false;
};
