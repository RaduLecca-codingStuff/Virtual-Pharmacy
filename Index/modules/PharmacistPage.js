import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import {  query,where, doc, setDoc, getDoc, addDoc, collection, getFirestore, getDocs } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

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

//adds new pacients
document.getElementById("AddThePacient").onclick =
    async function AddPacient() {
        var medRef = document.getElementById("addML").getElementsByTagName("select");

        var medList = "";
        for (i = 0; i < medRef.length; i++) {
            medlist += medRef[i].value.toString() + ";"
        }
        await addDoc(doc(db, "pacients"), {
            name: document.getElementById("addLN").value + " "+document.getElementById("addFN").value,
            cnp: document.getElementById("addC").value,
            adress: document.getElementById("addA").value,
            phone_number: document.getElementById("addPN").value,
            prescription_list: medList.split(";")
        });

    }

    //adds new Medicine
    document.getElementById("AddTheMedicine").onclick =
    async function AddMedicine(){

        var medref=collection(db,"medicine");
        await setDoc(doc(medref,document.getElementById("addMedName")),{
            expiration_date:document.getElementById("addExpirDate").value,
            lot:document.getElementById("addLot").value,
            quantity:document.getElementById("addQuantity").value,
        })
    }


    //used to get a list of possible medicine options
    async function RetrieveMedicineList()
    {
        var resultMedList=[];
        const querySnapshot = await getDocs(collection(db, "medicine"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            //console.log(doc.id.toString())

            resultMedList.push(doc.id.toString())
            console.log(document.getElementById("addML"));
            //document.getElementById("addML").innerHTML+=`<select name="MedicineSelect"> ${doc.id.toString()}</select>`;
        });
        return resultMedList;
    }

    
    async function EditPacient(){

        var setID;
        var reference = db.ref('pacients').orderByChild('cnp').equalTo("");
        ref.once('name', snapshot => {
            if (snapshot.exists()) {
                setID = snapshot.id;
                console.log(' User name: ' + setID);
            } else {
                console.log('There is no user ');
            }

        })

        async (e) => { //...
            await updateDoc(doc(db, "pacients",setID), {
               foo: 'bar'
             });
            }
    }