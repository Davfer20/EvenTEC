import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

const type = parseInt(localStorage.getItem('type'));
console.log(type);
const username = "";
const email = "";
const phone = "";
const carnet = "";
const sede = "";
const password = "";
const carrera = "";
const fullname = "";
const asociacion = "";
console.log(localStorage.getItem('userInfo'));
let userInfo = JSON.parse(localStorage.getItem('userInfo'));

const nameProfile = document.getElementById('nameProfile');
const carnetProfile = document.getElementById('carnetProfile');
const passwordProfile = document.getElementById('passwordProfile');
const emailProfile = document.getElementById('emailProfile');
const phoneProfile = document.getElementById('phoneProfile');
const sedeProfile = document.getElementById('sedeProfile');
const carreraProfile = document.getElementById('carreraProfile');
const descripcionProfile = document.getElementById('descripcionProfile');
const asoProfile = document.getElementById('asoProfile');
const saveButton = document.getElementById('saveProfileButton');

const nameProfileDiv = document.getElementById('nameProfileDiv');
const carnetProfileDiv = document.getElementById('carnetProfileDiv');
const passwordProfileDiv = document.getElementById('passwordProfileDiv');
const emailProfileDiv = document.getElementById('emailProfileDiv');
const phoneProfileDiv = document.getElementById('phoneProfileDiv');
const sedeProfileDiv = document.getElementById('sedeProfileDiv');
const carreraProfileDiv = document.getElementById('carreraProfileDiv');
const descripcionProfileDiv = document.getElementById('descripcionProfileDiv');
const asoProfileDiv = document.getElementById('asoProfileDiv');

// Estudiante
if (type === 0) {
    let username = userInfo.username;
    let email = userInfo.email;
    let phone = userInfo.phone;
    let carnet = userInfo.carnet;
    let sede = userInfo.sede;
    let password = userInfo.password;
    let carrera = userInfo.carrera;

    nameProfile.placeholder = username;
    carnetProfile.placeholder = carnet;
    passwordProfile.placeholder = password;
    emailProfile.placeholder = email;
    phoneProfile.placeholder = phone;
    sedeProfile.placeholder = sede;
    carreraProfile.placeHolder = carrera;

    descripcionProfileDiv.remove();
    asoProfileDiv.remove();
    console.log("User")
} else if (type === 1) { // Asociación
    let username = userInfo.displayname;
    let email = userInfo.email;
    let phone = userInfo.phone;
    let carrera = userInfo.carrera;
    let password = userInfo.password;
    let descripcion = userInfo.descripcion;

    nameProfile.placeholder = username;
    carnetProfileDiv.remove();
    passwordProfile.placeholder = password;
    emailProfile.placeholder = email;
    phoneProfile.placeholder = phone;
    sedeProfileDiv.remove();
    carreraProfile.placeHolder = carrera;
    descripcionProfile.placeHolder = descripcion;
    asoProfileDiv.remove();
} else if (type === 2) { // Colaborador
    let username = userInfo.fullname;
    let email = userInfo.email;
    let phone = userInfo.phone;
    let password = userInfo.password;
    let asociacion = userInfo.asociacion;

    nameProfile.placeholder = username;
    carnetProfileDiv.remove();
    passwordProfile.placeholder = password;
    emailProfile.placeholder = email;
    phoneProfile.placeholder = phone;
    sedeProfileDiv.remove();
    carreraProfileDiv.remove();
    descripcionProfileDiv.remove();
    asoProfile.placeholder = asociacion;
}

// funcion para activar la edicion del perfil
function activarEdit(){
    nameProfile.disabled = false;
    passwordProfile.disabled = false;
    emailProfile.disabled = false;
    phoneProfile.disabled = false;
    sedeProfile.disabled = false;
    carreraProfile.disabled = false;
    descripcionProfile.disabled = false;
    asoProfile.disabled = false;
    saveButton.disabled = false;
}

// Funcion para manejar el registro de estudiantes
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;
    return regex.test(email);
}

// Funcion para manejar el registro de estudiantes
async function editPerfilListener(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submitted")

    if (type === 0) {
        let username = (nameProfile.value || userInfo.username);
        let email = (emailProfile.value || userInfo.email);
        let phone = (phoneProfile.value || userInfo.phone);
        let carnet = userInfo.carnet;
        let sede = (sedeProfile.value || userInfo.sede);
        let password = (passwordProfile.value || userInfo.password);
        let carrera = (carreraProfile.value || userInfo.carrera);

        console.log("User")
    } else if (type === 1) { // Asociación
        let username = userInfo.displayname;
        let email = userInfo.email;
        let phone = userInfo.phone;
        let carrera = userInfo.carrera;
        let password = userInfo.password;
        let descripcion = userInfo.descripcion;

        nameProfile.placeholder = username;
        carnetProfileDiv.remove();
        passwordProfile.placeholder = password;
        emailProfile.placeholder = email;
        phoneProfile.placeholder = phone;
        sedeProfileDiv.remove();
        carreraProfile.placeHolder = carrera;
        descripcionProfile.placeHolder = descripcion;
        asoProfileDiv.remove();
    } else if (type === 2) { // Colaborador
        let username = userInfo.fullname;
        let email = userInfo.email;
        let phone = userInfo.phone;
        let password = userInfo.password;
        let asociacion = userInfo.asociacion;

        nameProfile.placeholder = username;
        carnetProfileDiv.remove();
        passwordProfile.placeholder = password;
        emailProfile.placeholder = email;
        phoneProfile.placeholder = phone;
        sedeProfileDiv.remove();
        carreraProfileDiv.remove();
        descripcionProfileDiv.remove();
        asoProfile.placeholder = asociacion;
    }

    // Get form input values
    const username = nameProfile.value;
    const carnet = carnetProfile.value;
    const password = passwordProfile.value;
    const email = emailProfile.value;
    const phone = phoneProfile.value;
    const sede = sedeProfile.value;
    const carrera = carreraProfile.value;
    const descripcion = descripcionProfile.value;
    const asoProfile = asoProfile.value;

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
const editButton = document.getElementById('editarProfileButton');
editButton.addEventListener('click', activarEdit);

// Attach an event listener to the form's submit event
const modificarPerfilForm = document.getElementById('modificarPerfilForm');
modificarPerfilForm.addEventListener('submit', editPerfilListener);

const errorButton = document.querySelector('.errorButton');
errorButton.addEventListener('click', closeError);