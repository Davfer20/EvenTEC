import { getDatabase, ref, set } from "firebase/database";

const database = getDatabase()

// Funcion para manejar el registro de estudiantes
function submitEstudianteListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const username = document.getElementById('usernameEstReg').value;
    const carnet = document.getElementById('carnetEstReg').value;
    const password = document.getElementById('passwordEstReg').value;
    const email = document.getElementById('emailEstReg').value;
    const phone = document.getElementById('phoneEstReg').value;
    const sede = document.getElementById('sedeEstReg').value;

    const dbref = ref(database);
    get(child(dbref, `users/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            set(ref(db, `users/${username}`), {
                username: username,
                carnet: carnet,
                password: password,
                email: email,
                phone: phone,
                sede: sede
            })
            console.log("Registered user: ");
            console.log(snapshot.val());
        }
    })
}

// Attach an event listener to the form's submit event
const estudianteForm = document.getElementById('registrarEstudianteForm');
estudianteForm.addEventListener('submit', submitEstudianteListener);