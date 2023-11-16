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
const app = initializeApp(firebaseConfig);
const db = getFirestore();


document.getElementById("AddPButton").onclick =
    function AddPacient() {
        var medRef = document.getElementById("addML").getElementsByTagName("select");

        var medList = "";
        for (i = 0; i < medRef.length; i++) {
            medlist += medRef[i].value.toString() + ";"
        }
        addDoc(doc(db, "pacients"), {
            first_name: document.getElementById("addFN").value,
            last_name: document.getElementById("addLN").value,
            cnp: document.getElementById("addC").value,
            adress: document.getElementById("addA").value,
            phone_number: document.getElementById("addPN").value,
            prescription_list: medList.split(";")
        });

    }


    function AddMedicine(){

    }