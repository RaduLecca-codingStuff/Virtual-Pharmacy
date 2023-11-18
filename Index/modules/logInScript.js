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

async function GetRequest(){
    var requestRef=collection(db,"requests");
    var snapshot=await getDocs(requestRef);
    var result = snapshot.docs.map(doc => doc.data());
    return result;
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
            var areDetailsCorrect = false;
            if (isPacient) {
                var username = document.getElementById("lnP").value + document.getElementById("fnP").value;
                var cnp = document.getElementById("cnpP").value;
                const pacientSnapshot = await getDocs(collection(db, "pacients"));
                pacientSnapshot.forEach((doc) => {
                    if ((username == doc.name) && (cnp == doc.cnp)) {
                        currentUserID = doc.id;
                        document.getElementById("PacientPage").style.display = "block";
                        areDetailsCorrect = true;
                        return;
                    }
                });
                if (!areDetailsCorrect) {
                    alert("Incorrect Pacient Login Details")
                }

                document.getElementById("fnP").value = "";
                document.getElementById("lnP").value = "";
                document.getElementById("cnpP").value = "";


            }
            else {

                var username = document.getElementById("lnPH").value + document.getElementById("fnPH").value;
                var password = document.getElementById("pswP").value;
                const pacientSnapshot = await getDocs(collection(db, "pharmacists"));
                pacientSnapshot.forEach((doc) => {
                    if ((username == doc.name) && (password == doc.password)) {
                        currentUserID = doc.id;
                        document.getElementById("PharmacistPage").style.display = "block";
                        areDetailsCorrect = true;
                        return;
                    }
                });
                if (!areDetailsCorrect) {
                    alert("Incorrect Pharmacist Login Details")
                }

                document.getElementById("fnPH").value = "";
                document.getElementById("lnPH").value = "";
                document.getElementById("pswP").value = "";
            }
            document.getElementById("login").style.display = "none";



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


//////////////////////////////
////  Pacient functions   ////
//////////////////////////////
{
    document.getElementById("OpenMedRequest").onclick=
    async function OpenMedRequest(){

        document.getElementById("MedRequest").style.display="block";
        //add retrieving values for the medicine and pharmacists and adding them to the site
        document.getElementById("PacientMainButtons").style.display="none";
    }
    async function MakeRequest(){
        if(currentUserType=="pacient")
        await addDoc(doc(db, "requests"), {
            fromPacient: currentUserID,
            medicineName: document.getElementById("chooseMedicine").value,
            toPharmacist: document.getElementById("chooseAPharmacist").value,
        });

    }
    
    async function DisplayPData(){
        //display a list of prescriptions here
        var pacientDoc=await getDoc(db,"pacients",currentUserID);

    }
    DisplayPData();
}

/////////////////////////////////
////  Pharmacist functions   ////
/////////////////////////////////
{

    document.getElementById("AddMed").style.display = "none";
    document.getElementById("AddPac").style.display = "none";
    document.getElementById("EditPacPres").style.display = "none";
    var curSelecReq;

    async function DisplayPHData(){
        var reqList=[];
        var pharmaDoc=await getDoc(db,"pharmacist",currentUserID);
        var reqDoc=await collection(db,"requests");
        (await reqDoc).foreach(async (doc)=>{
            if(doc.toPharmacist.toString()==pharmaDoc.name.toString())
            {
                reqList.push(doc);
                var pacientname=await getDoc(db,"pacients",doc.fromPacient);
                document.getElementById("PacientReqCollection").innerHTML+=`<div class="MedicineRequestUI" onclick="${OnRequestSelected()}" >${pacientname.name} - ${doc.medicineName}</div>`;
            }
        })

    }
    DisplayPHData();

    /// Pacient request system
    async function OnRequestSelected(ID){

        curSelecReq=await getDoc(db,"pharmacist",ID);
        document.getElementById("RequestApplyPopup").style.display="block";
        document.getElementById("EditPacPres").style.display="none";
        document.getElementById("PharmacistMainButtons").style.display="none";
    }

    document.getElementById("RAPyes").onclick =
    async function FulfillRequest(){

    }
    document.getElementById("RAPno").onclick =
    async function RejectRequest(){

    }
    document.getElementById("RAPleave").onclick =
    function LeaveLater(){

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


    //unfinished Pacient edit function       EDIT IT SO IT"S FINISHED
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
}


