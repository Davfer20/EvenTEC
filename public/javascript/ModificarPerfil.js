import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"

const database = getDatabase(app)

const type = parseInt(localStorage.getItem('type'));
console.log(type);
console.log(localStorage.getItem('userInfo'));
let userInfo = JSON.parse(localStorage.getItem('userInfo'));

const userProfile = document.getElementById('userProfile');
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

const userProfileDiv = document.getElementById('userProfileDiv');
const nameProfileDiv = document.getElementById('nameProfileDiv');
const carnetProfileDiv = document.getElementById('carnetProfileDiv');
const passwordProfileDiv = document.getElementById('passwordProfileDiv');
const emailProfileDiv = document.getElementById('emailProfileDiv');
const phoneProfileDiv = document.getElementById('phoneProfileDiv');
const sedeProfileDiv = document.getElementById('sedeProfileDiv');
const carreraProfileDiv = document.getElementById('carreraProfileDiv');
const descripcionProfileDiv = document.getElementById('descripcionProfileDiv');
const asoProfileDiv = document.getElementById('asoProfileDiv');

function loadPlaceholders(){
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
        carreraProfile.placeholder = carrera;

        userProfileDiv.remove();
        descripcionProfileDiv.remove();
        asoProfileDiv.remove();
        console.log("User")
    } else if (type === 1) { // Asociación
        let username = userInfo.username;
        let displayname = userInfo.displayname;
        let email = userInfo.email;
        let phone = userInfo.phone;
        let carrera = userInfo.carrera;
        let password = userInfo.password;
        let descripcion = userInfo.descripcion;

        userProfile.placeholder = username;
        nameProfile.placeholder = displayname;
        carnetProfileDiv.remove();
        passwordProfile.placeholder = password;
        emailProfile.placeholder = email;
        phoneProfile.placeholder = phone;
        sedeProfileDiv.remove();
        carreraProfile.placeholder = carrera;
        descripcionProfile.placeholder = descripcion;
        asoProfileDiv.remove();
    } else if (type === 2) { // Colaborador
        let username = userInfo.username;
        let fullname = userInfo.fullname;
        let email = userInfo.email;
        let phone = userInfo.phone;
        let password = userInfo.password;
        let asociacion = userInfo.asociacion;

        userProfile.placeholder = username;
        nameProfile.placeholder = fullname;
        carnetProfileDiv.remove();
        passwordProfile.placeholder = password;
        emailProfile.placeholder = email;
        phoneProfile.placeholder = phone;
        sedeProfileDiv.remove();
        carreraProfileDiv.remove();
        descripcionProfileDiv.remove();
        asoProfile.placeholder = asociacion;
    }
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

        if (!(validateEmail(email) && (email.endsWith("@estudiantec.cr") || email.endsWith("@itcr.ac.cr")))) {
            displayError("El correo no es válido. Debe ser un correo institucional @estudiantec.cr o @itcr.ac.cr");
            return;
        }

        try {
            await set(ref(database, `users/${carnet}`), {
                username: username,
                carnet: carnet,
                password: password,
                email: email,
                phone: phone,
                sede: sede,
                carrera: carrera
            })
            userInfo.username = username;
            userInfo.email = email;
            userInfo.phone = phone;
            userInfo.sede = sede;
            userInfo.password = password;
            userInfo.carrera = carrera;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            console.log("Modified user: ");
        } catch (error) {
            console.error("Error", error);
        }
    } else if (type === 1) { // Asociación
        let username = userProfile.value || userInfo.username;
        let displayname = nameProfile.value || userInfo.displayname;
        let email = emailProfile.value || userInfo.email;
        let phone = phoneProfile.value || userInfo.phone;
        let carrera = carreraProfile.value || userInfo.carrera;
        let password = passwordProfile.value || userInfo.password;
        let descripcion = descripcionProfile.value || userInfo.descripcion;

        if (!(validateEmail(email))) {
            displayError("El correo no es válido.");
            return;
        }
        
        set(ref(database, `asociaciones/${username}`), {
            username,
            displayname,
            carrera,
            descripcion,
            password,
            email,
            phone
        })

        userInfo.username = username;
        userInfo.displayname = displayname;
        userInfo.email = email;
        userInfo.phone = phone;
        userInfo.carrera = carrera;
        userInfo.password = password;
        userInfo.descripcion = descripcion;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log("Modified Asociacion: ");

    } else if (type === 2) { // Colaborador
        let username = userProfile.value || userInfo.username;
        let fullname = nameProfile.value || userInfo.fullname;
        let email = emailProfile.value || userInfo.email;
        let phone = phoneProfile.value || userInfo.phone;
        let password = passwordProfile.value || userInfo.password;
        let asociacion = asoProfile.value || userInfo.asociacion;

        if (!(validateEmail(email))) {
            console.log("here");
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

        set(ref(database, `colaboradores/${username}`), {
            fullname,
            username,
            password,
            email,
            phone,
            asociacion
        })

        userInfo.username = username;
        userInfo.fullname = fullname;
        userInfo.email = email;
        userInfo.phone = phone;
        userInfo.password = password;
        userInfo.asociacion = asociacion;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log("Modified Colaborador: ");
    }

    loadPlaceholders();
    nameProfile.disabled = true;
    passwordProfile.disabled = true;
    emailProfile.disabled = true;
    phoneProfile.disabled = true;
    sedeProfile.disabled = true;
    carreraProfile.disabled = true;
    descripcionProfile.disabled = true;
    asoProfile.disabled = true;
    saveButton.disabled = true;

    displayMessage("Aviso", "Su perfil se ha modificado correctamente.");
}

function displayMessage(title, message){
    const errorTitle = document.querySelector('.errorTitle');
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 1;
    errorContainer.style.zIndex = 1;

    errorTitle.textContent = title;
    const errorText = document.querySelector('.errorText');
    errorText.textContent = message;
}

function displayError(error) {
    const errorTitle = document.querySelector('.errorTitle');
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 1;
    errorContainer.style.zIndex = 1;

    errorTitle.textContent = "Alerta";
    const errorText = document.querySelector('.errorText');
    errorText.textContent = error;
}

function closeError() {
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 0;
    errorContainer.style.zIndex = -1;
}

function deleteAccount(){
    const deleteContainer = document.querySelector('.deleteContainer');
    deleteContainer.style.opacity = 1;
    deleteContainer.style.zIndex = 1;
}

async function confirmDelete(){
    if (type === 0) {
        console.log(userInfo.carnet);
        await remove(ref(database, `users/${userInfo.carnet}`));
    } else if (type === 1) {
        console.log(userInfo.username);
        await remove(ref(database, `asociaciones/${userInfo.username}`));
    } else {
        console.log(userInfo.username);
        await remove(ref(database, `colaboradores/${userInfo.username}`));
    }
    localStorage.clear();
    window.location.href = "../index.html";
}

function cancelDelete(){
    const deleteContainer = document.querySelector('.deleteContainer');
    deleteContainer.style.opacity = 0;
    deleteContainer.style.zIndex = -1;
}

loadPlaceholders();

const editButton = document.getElementById('editarProfileButton');
editButton.addEventListener('click', activarEdit);

// Attach an event listener to the form's submit event
const modificarPerfilForm = document.getElementById('modificarPerfilForm');
modificarPerfilForm.addEventListener('submit', editPerfilListener);

const errorButton = document.querySelector('.errorButton');
errorButton.addEventListener('click', closeError);

const eliminarProfileButton = document.getElementById('eliminarProfileButton');
eliminarProfileButton.addEventListener('click', deleteAccount);

const confirmDelButton = document.getElementById('confirmDelButton');
confirmDelButton.addEventListener('click', confirmDelete);

const cancelDelButton = document.getElementById('cancelDelButton');
cancelDelButton.addEventListener('click', cancelDelete);