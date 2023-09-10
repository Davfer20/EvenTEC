import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

// Funcion para manejar el registro de estudiantes
function loginColaboradorListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const username = document.getElementById('usernameEstLog').value;
    const password = document.getElementById('passwordEstLog').value;

    const dbref = ref(database);
    get(child(dbref, `colaboradores/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            set(ref(database, `/login`), {
                username: username,
                password: password,
                type: 2
            })
            console.log(snapshot.val());
        } else {
            console.log("Colaborador no registrada:");
        }
    })
}

// Attach an event listener to the form's submit event
const colaboradorForm = document.getElementById('loginColaboradorForm');
console.log(colaboradorForm);
colaboradorForm.addEventListener('submit', loginColaboradorListener);