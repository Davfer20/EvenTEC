import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

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

    if (!(isEmail(email) && (email.endsWith("@estudiantec.cr") || email.endsWith("@itcr.ac.cr")))) {
        displayError("El correo no es válido. Debe ser un correo institucional @estudiantec.cr o @itcr.ac.cr")
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
                username: username,
                password: password,
                email: email,
                phone: phone,
                sede: sede
            })
            console.log("Registered user: ");
            window.location.href = "loginE.html"
        }
    } catch (error) {
        console.error("Error", error);
    }
}

function displayError(error) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.opacity = 1

    const errorText = document.getElementById('errorText');
    errorText.textContent = error;
}

function closeError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.opacity = 0
}

// Attach an event listener to the form's submit event
const estudianteForm = document.getElementById('registrarEstudianteForm');
console.log(estudianteForm);
estudianteForm.addEventListener('submit', submitEstudianteListener);

const errorButton = document.getElementById('errorButton')
errorButton.addEventListener('click', closeError);