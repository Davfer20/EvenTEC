import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;
    return regex.test(email);
}

// Funcion para manejar el registro de estudiantes
async function submitColaboradorListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const fullname = document.getElementById('nameColReg').value;
    const username = document.getElementById('usernameColReg').value;
    const password = document.getElementById('passwordColReg').value;
    const email = document.getElementById('emailColReg').value;
    const phone = document.getElementById('phoneColReg').value;
    const asociacion = document.getElementById('asociacionColReg').value;

    if (!validateEmail(email)) {
        displayError("El correo no es válido.");
        return;
    }

    const dbref = ref(database);

    if (asociacion.length !== 0){
        let asociacionInvalid = false;
        await get(child(dbref, `asociaciones/${asociacion}`)).then((snapshot) => {
            if (!snapshot.exists()) {
                asociacionInvalid = true;
                displayError("La asociación con el usuario dado no existe");
            }
        });
        if (asociacionInvalid) {
            return;
        }
    }

    get(child(dbref, `colaboradores/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            displayError("Ya existe un colaborador con ese nombre de usuario.");
            console.log(snapshot.val());
        } else {
            set(ref(database, `colaboradores/${username}`), {
                fullname,
                username,
                password,
                email,
                phone,
                asociacion
            })
            console.log("Registered Colaborador: ");
            location.href = "loginC.html"
        }
    })
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
const colaboradorForm = document.getElementById('registrarColaboradorForm');
console.log(colaboradorForm);
colaboradorForm.addEventListener('submit', submitColaboradorListener);

const errorButton = document.querySelector('.errorButton');
errorButton.addEventListener('click', closeError);
