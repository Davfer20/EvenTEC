import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js";

const database = getDatabase(app)

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;
    return regex.test(email);
}

// Funcion para manejar el registro de estudiantes
async function submitEstudianteListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")

    // Get form input values
    const username = document.getElementById('usernameEstReg').value;
    const carnet = document.getElementById('carnetEstReg').value;
    const password = document.getElementById('passwordEstReg').value;
    const email = document.getElementById('emailEstReg').value;
    const phone = document.getElementById('phoneEstReg').value;
    const sede = document.getElementById('sedeEstReg').value;
    const carrera = document.getElementById('carreraEstReg').value;

    if (!(validateEmail(email) && (email.endsWith("@estudiantec.cr") || email.endsWith("@itcr.ac.cr")))) {
        displayError("El correo no es válido. Debe ser un correo institucional @estudiantec.cr o @itcr.ac.cr");
        return;
    } 

    const dbref = ref(database);
    try {
        const snapshot = await get(child(dbref, `users/${carnet}`));
        if (snapshot.exists()) {
            displayError("Usuario ya registrado. No puede registrarse otra vez")
            console.log(snapshot.val());
        } else {
            await set(ref(database, `users/${carnet}`), {
                carnet: carnet,
                username: username,
                password: password,
                email: email,
                phone: phone,
                sede: sede,
                carrera: carrera
            })
            console.log("Registered user: ");
            window.location.href = "loginE.html"
        }
    } catch (error) {
        console.error("Error", error);
    }
}

function displayError(error) {
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 1;
    errorContainer.style.zIndex = 1;

    const errorText = document.querySelector('.errorText');
    errorText.textContent = error;
}

function closeError() {
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 0;
    errorContainer.style.zIndex = -1;
}


// Attach an event listener to the form's submit event
const estudianteForm = document.getElementById('registrarEstudianteForm');
console.log(estudianteForm);
estudianteForm.addEventListener('submit', submitEstudianteListener);

const errorButton = document.querySelector('.errorButton');
errorButton.addEventListener('click', closeError);