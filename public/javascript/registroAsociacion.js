import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;
    return regex.test(email);
}

// Funcion para manejar el registro de estudiantes
function submitAsociacionListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const username = document.getElementById('usernameAsoReg').value;
    const displayname = document.getElementById('displaynameAsoReg').value;
    const carrera = document.getElementById('carreraAsoReg').value;
    const descripcion = document.getElementById('descripcionAsoReg').value;
    const password = document.getElementById('passwordAsoReg').value;
    const email = document.getElementById('emailAsoReg').value;
    const phone = document.getElementById('phoneAsoReg').value;

    if (!(validateEmail(email) && (email.endsWith("@estudiantec.cr") || email.endsWith("@itcr.ac.cr")))) {
        displayError("El correo no es válido.");
        return;
    }
    
    const dbref = ref(database);
    get(child(dbref, `asociaciones/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            displayError("Asociación ya registrada. No puede registrarse otra vez")
            console.log(snapshot.val());
        } else {
            set(ref(database, `asociaciones/${username}`), {
                username,
                displayname,
                carrera,
                descripcion,
                password,
                email,
                phone
            })
            console.log("Registered Asociacion: ");
            location.href = "loginA.html"
        }
    })
}

function displayError(error) {
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 1
    errorContainer.style.zIndex = 1;

    const errorText = document.querySelector('.errorText');
    errorText.textContent = error;
}

function closeError() {
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 0
    errorContainer.style.zIndex = 1;
}

// Attach an event listener to the form's submit event
const asociacionForm = document.getElementById('registrarAsociacionForm');
console.log(asociacionForm);
asociacionForm.addEventListener('submit', submitAsociacionListener);

const errorButton = document.querySelector('.errorButton');
errorButton.addEventListener('click', closeError);