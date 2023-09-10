import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

// Funcion para manejar el registro de estudiantes
function submitColaboradorListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const fullname = document.getElementById('nameColReg').value;
    const username = document.getElementById('usernameColReg').value;
    const password = document.getElementById('passwordColReg').value;
    const email = document.getElementById('emailColReg').value;
    const phone = document.getElementById('phoneColReg').value;

    const dbref = ref(database);
    get(child(dbref, `colaboradores/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            set(ref(database, `colaboradores/${username}`), {
                fullname,
                username,
                password,
                email,
                phone
            })
            console.log("Registered Asociacion: ");
            location.href = "loginC.html"
        }
    })
}

// Attach an event listener to the form's submit event
const colaborForm = document.getElementById('registrarColaborarForm');
console.log(colaborForm);
colaborForm.addEventListener('submit', submitColaboradorListener);