import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

// Funcion para manejar el registro de estudiantes
function loginAsociacionListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const username = document.getElementById('usernameEstLog').value;
    const password = document.getElementById('passwordEstLog').value;

    const dbref = ref(database);
    get(child(dbref, `asociaciones/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            set(ref(database, `/login`), {
                username: username,
                password: password,
                type: 1
            })
            console.log(snapshot.val());
        } else {
            console.log("Asociación no registrada:");
        }
    })
}

// Attach an event listener to the form's submit event
const asociacionForm = document.getElementById('loginAsociacionForm');
console.log(asociacionForm);
asociacionForm.addEventListener('submit', loginAsociacionListener);