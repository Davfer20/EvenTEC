import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

// Funcion para manejar el registro de estudiantes
function loginEstudianteListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const username = document.getElementById('usernameEstLog').value;
    const password = document.getElementById('passwordEstLog').value;

    const dbref = ref(database);
    get(child(dbref, `users/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val()['password'] === password){
                localStorage.setItem("type", String(0));
                localStorage.setItem("userInfo", JSON.stringify(snapshot.val()));
                console.log(snapshot.val());
                window.location.href = "eventPage.html"
            } else {
                displayError("Contraseña incorrecta");
            }
        } else {
            displayError("Usuario no registrado. Revise su carnet y contraseña.");
            console.log("Usuario no registrado:");
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
const estudianteForm = document.getElementById('loginEstudianteForm');
console.log(estudianteForm);
estudianteForm.addEventListener('submit', loginEstudianteListener);

const errorButton = document.querySelector('.errorButton');
console.log(errorButton)
errorButton.addEventListener('click', closeError);