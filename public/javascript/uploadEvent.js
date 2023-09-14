import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js'

const db = getDatabase(app);

let refName;
let eventosRef;
let newEventoRef;
let userDisplayName;

const userDisplay = document.getElementById('user');

let userInfo = JSON.parse(localStorage.getItem('userInfo'));
const type = parseInt(localStorage.getItem('type'));
console.log(userInfo);
userDisplay.querySelector('.username').textContent = userInfo.username;


function submit() {
    if (type === 1) {
        refName = 'eventos';
        userDisplayName = userInfo.displayname;
    }
    else {
        refName = 'propuestas';
        userDisplayName = userInfo.username;
    }
    eventosRef = ref(db, refName);
    newEventoRef = push(eventosRef); // Genera una referencia con ID automático
    submitEvento();
}


async function submitEvento() {
    const item = document.getElementById('eventData')
    const titulo = item.querySelector('.title').value;
    const imagenSrc = item.querySelector('.image').getAttribute('src')
    const userAsociacion = userInfo.username;

    const fecha = item.querySelector('.startDate').value;
    const fechaHorario = `${item.querySelector('.startDate').value} - ${item.querySelector('.endDate').value}`;
    const capacidad = isNaN(item.querySelector('.capacity').value) ? 100 : item.querySelector('.capacity').value;
    const descripcion = item.querySelector('.description').value;
    const requerimientos = item.querySelector('.requirements').value;
    const cupos = 0;
    const userSrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOW34PFNB2wJ1Hf5AP88UYB4d-LDcOsC7i4g&usqp=CAU";
    const inputCategories = item.querySelectorAll('.cat');
    const rating = 0;
    const clicks = 0;

    let categorias = [];
    inputCategories.forEach((inputElement) => {
        const categoria = inputElement.value;
        if (categoria) {
            categorias.push(categoria);
        }
    });

    const colabList = await validarTodosLosColabs();
    console.log(colabList);
    if (!colabList) {
        return;
    }

    let nuevoEvento = new Evento(
        newEventoRef.key,
        titulo,
        imagenSrc,
        userDisplayName,
        userAsociacion,
        fecha,
        capacidad,
        categorias,
        descripcion,
        requerimientos,
        fechaHorario,
        cupos,
        userSrc,
        rating,
        clicks
    );

    console.log('newEvento')
    console.log(newEventoRef)
    set(newEventoRef, nuevoEvento); // Sube el objeto evento a la base de datos
    subirTodasLasActividades();
    const eventoRef = ref(db, `${refName}/${newEventoRef.key}/colabs`);
    await set(eventoRef, colabList);
    window.location.href = "eventPage.html";
}

function subirTodasLasActividades() {

    const eventoRef = ref(db, `${refName}/${newEventoRef.key}/activities`);

    // Obtén una lista de todos los elementos de actividad en el contenedor
    const actividades = document.querySelectorAll('.column.act');

    // Recorre cada elemento de actividad y sube sus datos a Firebase
    actividades.forEach((actividad) => {
        const titulo = actividad.querySelector('.title.activity').value;
        const imagenPlaceholder = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOW34PFNB2wJ1Hf5AP88UYB4d-LDcOsC7i4g&usqp=CAU";
        const moderador = actividad.querySelector('.actMod').value;
        const fecha = actividad.querySelector('.actDate').value;
        const imagen = actividad.querySelector('.image').getAttribute('src');

        // Crea un objeto de actividad con los datos obtenidos
        const nuevaActividad = new Actividad(
            titulo,
            imagen,
            imagenPlaceholder, // Por ahora, coloca una imagen de marcador de posición
            moderador,
            fecha
        );

        console.log(nuevaActividad)
        // Genera una referencia con ID automático para la nueva actividad
        const newActivityRef = push(eventoRef);
        // Sube el objeto de actividad a la base de datos
        set(newActivityRef, nuevaActividad);

    });
}


async function validarTodosLosColabs() {
    const colabs = document.querySelectorAll('.colabs.user');
    console.log(colabs);

    const snapshot = await get(ref(db, 'colaboradores'));
    const colaboradores = snapshot.val();

    console.log("OUT", colaboradores);
    let colabList = [];
    let invalid = false;
    colabs.forEach((colab) => {
        let valid = false;
        const colabName = colab.querySelector('.username').value;
        console.log("colabName", colabName);
        Object.keys(colaboradores).forEach((username) => {
            console.log(username, colabName, (username == colabName), (username == colabName))
            if ((username == colabName) || (colaboradores[username]["fullname"] == colabName)) {
                colabList.push(colabName);
                valid = true;
            }
        })
        if (!valid) {
            displayError("Ha ingresado colaboradores que no existen. Ingrese el nombre de usuario o el nombre completo.");
            invalid = true;
            return;
        }
    });
    if (!invalid) {
        return colabList;
    } else {
        return null;
    }

}


const submitButton = document.getElementById('buttonSubmit')
submitButton.addEventListener('click', submit);


function submitImage() {
    const imagen = inputImagenEvento.files[0];
    if (imagen) {
        // Crea un objeto FileReader para leer la imagen
        const reader = new FileReader();
        // Define una función para manejar la carga de la imagen
        reader.onload = function () {
            const imagenBase64 = reader.result; // Contiene la imagen en formato Base64

            const imagenMostrada = document.getElementById('image');
            imagenMostrada.src = imagenBase64;
        };
        // Lee la imagen como Base64
        reader.readAsDataURL(imagen);
    } else {
        // El usuario no seleccionó una imagen
        alert('Por favor, seleccione una imagen.');
    }
}

const inputImagenEvento = document.getElementById('eventImage')
inputImagenEvento.addEventListener('change', submitImage);

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

const errorButton = document.querySelector('.errorButton');
errorButton.addEventListener('click', closeError);
