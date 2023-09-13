import { getDatabase, get, ref, onValue, child, update, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js';

const db = getDatabase(app)

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('eventId');

const eventosRef = ref(db, 'eventos'); // Reemplaza 'eventos' con la ubicación correcta en tu base de datos

const eventoRef = child(eventosRef, eventId);
const container = document.getElementById('eventData');

const colabsRef = child(eventoRef, 'colabs');
const footer = document.getElementById('footer');
let cupos = 0;
let capacidad = 0;

await get(eventoRef).then((snapshot) => {
    const eventoData = snapshot.val();
    console.log(eventoData);
    if (eventoData) {
        const evento = new Evento(
            eventId,
            eventoData.titulo,
            eventoData.imagenSrc,
            eventoData.nombreAsociacion,
            eventoData.fecha,
            eventoData.capacidad,
            eventoData.categorias,
            eventoData.descripcion,
            eventoData.requerimientos,
            eventoData.fechaHorario,
            eventoData.cupos,
            eventoData.userSrc,
            eventoData.rating
        );
        container.appendChild(evento.toExtendedHTML())
        const colabHTML = document.createElement('div');
        colabHTML.className = 'colabs';
        colabHTML.innerHTML = `
        <img src="${eventoData.userSrc}" alt="Usuario">
        <span>${eventoData.nombreAsociacion}</span>
        `;
        footer.appendChild(colabHTML)
        cupos = eventoData.cupos;
        capacidad = eventoData.capacidad;
        console.log("evento loaded");
    } else {
        // Maneja el caso en el que no se encuentre el evento
        console.log('Evento no encontrado');
    }
});

function inscribirUsuario(){
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"))["carnet"];
    console.log(loggedUser, cupos, capacidad);
    if (cupos < capacidad) {
        const updates = {};
        updates[`/inscritos/${eventId}/` + loggedUser] = true;
        updates[`/userEventos/${loggedUser}/` + eventId] = true;
        updates[`/eventos/${eventId}/cupos`] = cupos + 1;
        update(ref(db), updates);
        displayMessage("Éxito", "¡Felicitaciones, ha sido inscrito al evento! Revise su correo.");
        inscribirButton.removeEventListener('click', inscribirUsuario);
        inscribirButton.textContent = "Cancelar";
        inscribirButton.addEventListener('click', desinscribirUsuario);
    } else {
        displayError("Lo lamentamos. Ya no hay cupo para el evento.");
    }
}

function desinscribirUsuario(){
    const cancelContainer = document.querySelector('.cancelContainer');
    cancelContainer.style.opacity = 1;
    cancelContainer.style.zIndex = 1;
}

async function confirmCancel(){
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"))["carnet"];
    const updates = {};
    updates[`/inscritos/${eventId}/` + loggedUser] = false;
    updates[`/userEventos/${loggedUser}/` + eventId] = false;
    updates[`/eventos/${eventId}/cupos`] = cupos - 1;
    update(ref(db), updates);
    displayMessage("Éxito", "Se ha desinscrito del evento.");
    inscribirButton.removeEventListener('click', desinscribirUsuario);
    inscribirButton.textContent = "Inscribirme";
    inscribirButton.addEventListener('click', inscribirUsuario);
    const cancelContainer = document.querySelector('.cancelContainer');
    cancelContainer.style.opacity = 0;
    cancelContainer.style.zIndex = -1;
}

function cancelCancel(){
    const cancelContainer = document.querySelector('.cancelContainer');
    cancelContainer.style.opacity = 0;
    cancelContainer.style.zIndex = -1;
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

const errorButton = document.querySelector('.errorButton');
errorButton.addEventListener('click', closeError);

const confirmCanButton = document.getElementById('confirmCanButton');
confirmCanButton.addEventListener('click', confirmCancel);

const cancelCanButton = document.getElementById('cancelCanButton');
cancelCanButton.addEventListener('click', cancelCancel);
console.log("here");
const inscribirButton = document.getElementById('inscribirButton');

const verListButton = document.getElementById('verListButton');

const type = parseInt(localStorage.getItem('type'));
if (type === 0){
    verListButton.remove();
    let inscrito = false;
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"))["carnet"];
    get(ref(db, `userEventos/${loggedUser}`)).then((snapshot) => {
        const eventos = snapshot.val();
        console.log(loggedUser, eventos);
        if (eventos){
            for (const key in eventos) {
                if (Object.hasOwnProperty.call(eventos, key)) {
                    console.log(eventos[key]);
                    if (key === eventId && eventos[key]){
                        inscrito = true;
                        break;
                    }
                };
            };
        }
        if (inscrito){
            inscribirButton.textContent = "Cancelar";
            inscribirButton.addEventListener('click', desinscribirUsuario);
        } else {
            inscribirButton.textContent = "Inscribirme";
            inscribirButton.addEventListener('click', inscribirUsuario);
        }
    });
} else {
    inscribirButton.remove();
}

onValue(child(eventoRef, 'cupos'), (snapshot) => {
    console.log("cupos");
    console.log(snapshot.val());
    cupos = snapshot.val();
    const cuposEventPage = document.getElementById("cuposEventPage");
    cuposEventPage.textContent = `Cupos: ${cupos}/${capacidad}`;
});

onValue(child(eventoRef, 'capacidad'), (snapshot) => {
    console.log("capacidad");
    console.log(snapshot.val());
    capacidad = snapshot.val();
    const cuposEventPage = document.getElementById("cuposEventPage");
    cuposEventPage.textContent = `Cupos: ${cupos}/${capacidad}`;
});

const activitiesRef = child(eventoRef, 'activities');
const containerA = document.getElementById('container');


onValue(activitiesRef, (snapshot) => {
    const activitiesData = snapshot.val();
    if (activitiesData) {
        for (const key in activitiesData) {
            if (Object.hasOwnProperty.call(activitiesData, key)) {
                const activitiyData = activitiesData[key];
                const actividad = new Actividad(
                    activitiyData.titulo,
                    activitiyData.imagenSrc,
                    activitiyData.userSrc,
                    activitiyData.nombreModerador,
                    activitiyData.fecha
                );
                containerA.appendChild(actividad.toHTML());
            };
        };
    } else {
        // Maneja el caso en el que no se encuentre el evento
        console.log('Actividad no encontrado');
    }
});

onValue(colabsRef, (snapshot) => {
    const colabsData = snapshot.val();
    console.log(colabsData);

    if (colabsData) {
        for (const i in colabsData) {
            const colabHTML = document.createElement('div');
            colabHTML.className = 'colabs';
            colabHTML.innerHTML = `
            <img src="../images/test.jpg" alt="Usuario">
            <span>${colabsData[i]}</span>
             `;

            footer.appendChild(colabHTML)

        };

    } else {
        // Maneja el caso en el que no se encuentre el evento
        console.log('Actividad no encontrado');
    }
});