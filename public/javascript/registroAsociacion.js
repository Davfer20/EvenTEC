import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

// Funcion para manejar el registro de estudiantes
function submitAsociacionListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const username = document.getElementById('usernameAsoReg').value;
    const carnet = document.getElementById('carreraAsoReg').value;
    const password = document.getElementById('passwordAsoReg').value;
    const email = document.getElementById('emailAsoReg').value;
    const phone = document.getElementById('phoneAsoReg').value;

    const dbref = ref(database);
    get(child(dbref, `asociaciones/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            set(ref(database, `asociaciones/${username}`), {
                username,
                carnet,
                password,
                email,
                phone
            })
            console.log("Registered Asociacion: ");
            location.href = "loginA.html"
        }
    })
}

// Attach an event listener to the form's submit event
const asociacionForm = document.getElementById('registrarAsociacionForm');
console.log(asociacionForm);
asociacionForm.addEventListener('submit', submitAsociacionListener);