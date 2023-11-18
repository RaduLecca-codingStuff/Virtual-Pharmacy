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

document.getElementById("AddMed").style.display = "none";
document.getElementById("AddPac").style.display = "none";
document.getElementById("EditPacPres").style.display = "none";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

//menu navigation
document.getElementById("OpenMedicineAddMenu").onclick =
    function OpenMedicineAddMenu() {
        document.getElementById("PharmacistMainButtons").style.display = "none";
        document.getElementById("AddMed").style.display = "block";
    }
document.getElementById("OpenPacientAddMenu").onclick =
    async function OpenPacientAddMenu() {
        document.getElementById("PharmacistMainButtons").style.display = "none";
        var cMedList = RetrieveMedicineList();
        (await cMedList).forEach((med) => {
            document.getElementById("addML").innerHTML += `<option value="MedicineSelect"> ${med}</option>`;
        });
        document.getElementById("AddPac").style.display = "block";
    }


//adds new pacients
document.getElementById("AddThePacient").onclick =
    async function AddPacient() {
        var medRef = document.getElementById("addML").getElementsByTagName("select");

        var medList = "";
        for (i = 0; i < medRef.length; i++) {
            medlist += medRef[i].value.toString() + ";"
        }
        await addDoc(doc(db, "pacients"), {
            name: document.getElementById("addLN").value + " " + document.getElementById("addFN").value,
            cnp: document.getElementById("addC").value,
            adress: document.getElementById("addA").value,
            phone_number: document.getElementById("addPN").value,
            prescription_list: medList.split(";")
        });

    }

//adds new Medicine
document.getElementById("AddTheMedicine").onclick =
    async function AddMedicine() {

        var medref = collection(db, "medicine");
        await setDoc(doc(medref, document.getElementById("addMedName")), {
            expiration_date: document.getElementById("addExpirDate").value,
            lot: document.getElementById("addLot").value,
            quantity: document.getElementById("addQuantity").value,
        })
    }


//used to get a list of possible medicine options
async function RetrieveMedicineList() {
    var resultMedList = [];
    const querySnapshot = await getDocs(collection(db, "medicine"));
    querySnapshot.forEach((doc) => {
        resultMedList.push(doc.id.toString())
        console.log(document.getElementById("addML"));
    });
    return resultMedList;
}


async function EditPacient() {

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
        await updateDoc(doc(db, "pacients", setID), {
            foo: 'bar'
        });
    }
}