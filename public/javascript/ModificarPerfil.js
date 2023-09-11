import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

const type = localStorage.getItem('type');
const username = "";
const email = "";
const phone = "";
const carnet = "";
const sede = "";
const password = "";
const carrera = "";
const fullname = "";
const asociacion = "";
let userInfo = JSON.parse(localStorage.getItem('userInfo'));
// Estudiante
if (type === 0) {
    let username = userInfo.username;
    let email = userInfo.email;
    let phone = userInfo.phone;
    let carnet = userInfo.carnet;
    let sede = userInfo.sede;
    let password = userInfo.password;
    let carrera = userInfo.carrera;
} else if (type === 1) { // Asociación
    let username = userInfo.username;
    let email = userInfo.email;
    let phone = userInfo.phone;
    let carrera = userInfo.carrera;
    let password = userInfo.password;
} else if (type === 2) { // Colaborador
    let username = userInfo.username;
    let email = userInfo.email;
    let phone = userInfo.phone;
    let password = userInfo.password;
    let asociacion = userInfo.asociacion;
    let fullname = userInfo.fullname;
}

/*
const username = "";
const email = "";
const phone = "";
const carnet = "";
const sede = "";
const password = "";

const dbref = ref(database);
get(child(dbref, `login`)).then((snapshot) => {
    if (snapshot.exists()) {
        if (snapshot.val()['type'] === 0) {
            get(child(dbref, `users/${snapshot.val()['username']}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const username = snapshot.val()['username'];
                    const email = snapshot.val()['email'];
                    const phone = snapshot.val()['phone'];
                    const carnet = snapshot.val()['carnet'];
                    const sede = snapshot.val()['sede'];
                    const password = snapshot.val()['password'];
                } else {
                    displayError("Usuario no registrado. Revise su carnet y contraseña.");
                    console.log("Usuario no registrado:");
                }
            })
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

// Funcion para manejar el registro de estudiantes
function editPerfilListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")
    // Get form input values
    const username = document.getElementById('usernameEstLog').value;
    const password = document.getElementById('passwordEstLog').value;

    const dbref = ref(database);
    get(child(dbref, `users/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val()['password'] === password) {
                set(ref(database, `/login`), {
                    username: username,
                    password: password,
                    type: 0
                })
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
*/