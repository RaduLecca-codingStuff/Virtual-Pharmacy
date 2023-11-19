import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { query, where, doc, setDoc, getDoc, addDoc, deleteDoc, collection, getFirestore, getDocs } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';


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

var currentUserData;
var currentUserID;
var currentUserType;
//used to get a list of possible medicine options
async function RetrieveMedicineList() {
    var resultMedList = [];
    const querySnapshot = await getDocs(collection(db, "medicine"));
    querySnapshot.forEach((doc) => {
        resultMedList.push(doc.id.toString())
    });
    return resultMedList;
}


async function GetPacients() {
    var pacientRef = collection(db, 'pacients');
    var snapshot = await getDocs(pacientRef);
    var result = snapshot.docs.map(doc => doc.data());
    return result;
}
async function GetMedicine() {
    var medRef = collection(db, "medications");
    var snapshot = await getDocs(medRef);
    var result = snapshot.docs.map(doc => doc.data());
    return result;
}
async function GetPharmacist() {
    var pharmacistRef = collection(db, "pharmacists");
    var snapshot = await getDocs(pharmacistRef);
    var result = snapshot.docs.map(doc => doc.data());
    return result;
}

async function GetRequest() {
    var requestRef = collection(db, "requests");
    var snapshot = await getDocs(requestRef);
    var result = snapshot.docs.map(doc => doc.data());
    return result;
}


//////////////////////////////
////  Pacient functions   ////
//////////////////////////////
{
    document.getElementById("MedRequest").style.display = "none";

    async function DisplayPData() {
        //display a list of prescriptions here
        document.getElementById("PacientInfo").innerHTML =
            `<h4>${currentUserData.name}</h4><br>
        <h4>CNP : ${currentUserData.cnp}</h4>`;
    }

    document.getElementById("OpenMedRequest").onclick =
        async function OpenMedRequest() {

            document.getElementById("MedRequest").style.display = "block";
            document.getElementById("Prescriptions").style.display = "none";
            var medNames = await RetrieveMedicineList();
            medNames.foreach(async (med) => {
                document.getElementById("chooseMedicine").innerHTML += `<option value="${med}">${med}</option>`;
            })
            var pharNames = await GetPharmacist();
            pharNames.foreach(async (phar) => {
                document.getElementById("chooseAPharmacist").innerHTML += `<option value="${phar}">${phar}</option>`;
            })
            //add retrieving values for the medicine and pharmacists and adding them to the site
            document.getElementById("PacientMainButtons").style.display = "none";
        }


    document.getElementById("SubmitMedRequest").onclick =
        async function MakeRequest() {
            if (currentUserType == "pacient")
                await addDoc(doc(db, "requests"), {
                    fromPacient: currentUserID,
                    medicineName: document.getElementById("chooseMedicine").options[document.getElementById("chooseMedicine").selectedIndex].text,
                    toPharmacist: document.getElementById("chooseAPharmacist").options[document.getElementById("chooseAPharmacist").selectedIndex].text,
                });
            alert("Request was sent");
            document.getElementById("MedRequest").style.display = "none";
            document.getElementById("PacientMainButtons").style.display = "block";
            document.getElementById("Prescriptions").style.display = "block";

        }



}

/////////////////////////////////
////  Pharmacist functions   ////
/////////////////////////////////
{

    document.getElementById("RequestApplyPopup").style.display = "none";
    document.getElementById("EditPrescriptions").style.display = "none";
    document.getElementById("PharmacistMainButtons").style.display = "block";
    document.getElementById("AddPac").style.display = "none";
    document.getElementById("AddMed").style.display = "none";
    var curSelecReq;

    //displays pharmacist data and requests made by pacients
    async function DisplayPHData() {

        document.getElementById("PharmacistInfo").innerHTML = `<h4>${currentUserData.name}</h4>`;
        var reqList = [];
        var reqDoc = await GetRequest();
        (await reqDoc).foreach(async (doc) => {
            if (doc.toPharmacist.toString() == currentUserData.name.toString()) {
                reqList.push(doc);
                var pacientname = await getDoc(db, "pacients", doc.fromPacient);
                document.getElementById("PacientReqCollection").innerHTML += `<div class="MedicineRequestUI" onclick="${OnRequestSelected(doc.id)}" >${pacientname.data().name} - ${doc.medicineName}</div>`;

            }
        })

    }
    /// Pacient request system
    async function OnRequestSelected(pc) {
        curSelecReq = await getDoc(db, "pacient", ID);
        document.getElementById("RequestApplyPopup").style.display = "block";
        document.getElementById("EditPacPres").style.display = "none";
        document.getElementById("PharmacistMainButtons").style.display = "none";
    }
    document.getElementById("RAPyes").onclick =
        async function FulfillRequest() {
            //update pacient's prescription
            var newPrescription = curSelecReq.data().prescription_list;
            newPrescription.push(curSelecReq.data().medicineName);
            await updateDoc(doc(db, "pacients", curSelecReq.data().fromPacient), {
                prescription_list: newPrescription
            });
            ReturntoPharmacistMenu();
        }
    document.getElementById("RAPno").onclick =
        async function RejectRequest() {
            //delete the request
            await deleteDoc(doc(db, "requests", curSelecReq.id));
            ReturntoPharmacistMenu();
        }
    document.getElementById("RAPleave").onclick =
        async function LeaveLater() {
            //close window and return to the usual screen.
            curSelecReq = '';
            ReturntoPharmacistMenu();
        }
    //universal function that resets the menu
    async function ReturntoPharmacistMenu() {
        document.getElementById("PharmacistDetails").style.display = "block";
        document.getElementById("PacientReqCollection").style.display = "block";
        document.getElementById("PharmacistMainButtons").style.display = "block";
        document.getElementById("RequestApplyPopup").style.display = "none";
        document.getElementById("EditPrescriptions").style.display = "none";
        document.getElementById("AddPac").style.display = "none";
        document.getElementById("AddMed").style.display = "none";
    }
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
                document.getElementById("addML").innerHTML += `<option value="${med}"> ${med}</option>`;
            });
            document.getElementById("AddPac").style.display = "block";
        }
    //adds new pacients
    document.getElementById("AddThePacient").onclick =
        async function AddPacient() {
            var medRef = document.getElementById("addML").getElementsByTagName("select");

            var medList;
            for (let i = 0; i < medRef.length; i++) {
                medlist += medRef[i].options[medRef[i].selectedIndex].text + ";"
            }

            await addDoc(collection(db, "pacients"), {
                name: document.getElementById("addLN").value + " " + document.getElementById("addFN").value,
                cnp: document.getElementById("addC").value,
                adress: document.getElementById("addA").value,
                phone_number: document.getElementById("addPN").value,
                prescription_list: medList.split(";")
            });

            alert("Pacient was added.");
            document.getElementById("addLN").value = "";
            document.getElementById("addFN").value = "";
            document.getElementById("addC").value = "";
            document.getElementById("addA").value = "";
            document.getElementById("addPN").value = "";
            ReturntoPharmacistMenu();

        }

    //adds new Medicine
    document.getElementById("AddTheMedicine").onclick =
        async function AddMedicine() {
            var medref = collection(db, "medicine");
            await setDoc(doc(medref, document.getElementById("addMedName").value), {
                expiration_date: document.getElementById("addExpirDate").value,
                lot: document.getElementById("addLot").value,
                quantity: document.getElementById("addQuantity").value,
            })

            alert("MNew Medicine was added");
            document.getElementById("addMedName").value = "";
            document.getElementById("addExpirDate").value = "";
            document.getElementById("addLot").value = "";
            document.getElementById("addQuantity").value = "";
            ReturntoPharmacistMenu();
        }

    //opens pacient edit function
    document.getElementById("OpenPrescribeMenu").onclick =
        async function openPrescribeMed() {
            document.getElementById("EditPrescriptions").style.display = "block";
            document.getElementById("PharmacistInfo").style.display = "none";
            document.getElementById("PharmacistMainButtons").style.display = "none";

            var medlist = RetrieveMedicineList();
            medlist.foreach((med) => {
                document.getElementById().innerHTML += `<option value="${med}">${med}</option>`;
            });
        }

    //Pacient edit function 
    document.getElementById("FinishEditPrescription").onclick =
        async function PrescribeMed() {

            var setID;
            var newpres;
            var p = await collection(db, "pacients");
            p.foreach(async (doc) => {
                if (document.getElementById("getCNP").value == doc.data().cnp) {
                    setID = doc.id;
                    newpres = doc.data().prescription_list;
                    return;
                }
            })

            newpres.push(document.getElementById("PrescribePacientMed").options[document.getElementById("PrescribePacientMed").selectedIndex].text);
            await updateDoc(doc(db, "pacients", setID), {
                prescription_list: newpres
            });
            ReturntoPharmacistMenu()
        }
}


////////////////////////////
////  Login functions   ////
////////////////////////////
{
    //login initial info
    document.getElementById("pacientLogIn").style.display = "none";
    document.getElementById("pharmaLogIn").style.display = "none";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("PacientPage").style.display = "none";
    document.getElementById("PharmacistPage").style.display = "none";
    var isPacient = false;

    //checks if the details were right and 
    document.getElementById("loginButton").onclick =
        async function LogIn() {
            var areDetailsCorrect;
            if (isPacient) {
                var username = document.getElementById("lnP").value + " " + document.getElementById("fnP").value;
                var cnp = document.getElementById("cnpP").value;
                var pacientSnapshot = await getDocs(collection(db, "pacients"));
                pacientSnapshot.forEach(async (doc) => {

                    if ((username == doc.data().name) && (cnp == doc.data().cnp) && pacientSnapshot != null) {
                        currentUserData = doc.data();
                        currentUserID = doc.id;
                        currentUserType = "pacient";
                        document.getElementById("PacientPage").style.display = "block";
                        document.getElementById("login").style.display = "none";
                        areDetailsCorrect = true;
                        return;
                    }
                });

                if (!areDetailsCorrect) {
                    alert("Incorrect Pacient Login Details");
                    document.getElementById("fnP").value = "";
                    document.getElementById("lnP").value = "";
                    document.getElementById("cnpP").value = "";
                }
                else {
                    await DisplayPData();
                }
            }
            else {

                var username = document.getElementById("lnPH").value + " " + document.getElementById("fnPH").value;
                var password = document.getElementById("pswP").value;
                var pharmaSnapshot = await getDocs(collection(db, "pharmacists"));
                pharmaSnapshot.forEach(async (doc) => {
                    if ((username == doc.data().name) && (password == doc.data().password) && pharmaSnapshot != null) {
                        currentUserData = doc.data();
                        currentUserID = doc.id;
                        currentUserType = "pharmacist";
                        document.getElementById("PharmacistPage").style.display = "block";
                        document.getElementById("login").style.display = "none";
                        areDetailsCorrect = true;
                        return;
                    }
                });
                if (!areDetailsCorrect) {
                    alert("Incorrect Pharmacist Login Details")
                    document.getElementById("fnPH").value = "";
                    document.getElementById("lnPH").value = "";
                    document.getElementById("pswP").value = "";
                }
                else {
                    await DisplayPHData();
                }
            }
        }
    document.getElementById("pButton").onclick =
        function pacientOption() {
            document.getElementById("pacientLogIn").style.display = "block";
            document.getElementById("pharmaLogIn").style.display = "none";
            document.getElementById("loginButton").style.display = "block";
            isPacient = true;
        };
    document.getElementById("phButton").onclick =
        function pharmaOption() {
            document.getElementById("pacientLogIn").style.display = "none";
            document.getElementById("pharmaLogIn").style.display = "block";
            document.getElementById("loginButton").style.display = "block";
            isPacient = false;
        };
}


