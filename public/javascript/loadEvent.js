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
        container.appendChild(evento.toExtendedHTML());
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
        const eventKey = push(child(ref(db), `inscritos/${eventId}`)).key;
        const userKey = push(child(ref(db), `userEventos/${loggedUser}`)).key;
        const updates = {};
        updates[`/inscritos/${eventId}/` + eventKey] = loggedUser;
        updates[`/userEventos/${loggedUser}/` + userKey] = eventKey;
        updates[`/eventos/${eventId}/cupos`] = cupos + 1;
        update(ref(db), updates);
        displayMessage("Éxito", "¡Felicitaciones, ha sido inscrito al evento! Revise su correo.");
        inscribirButton.removeEventListener('click', inscribirUsuario);
        inscribirButton.textContent = "Cancelar";
        inscribirButton.addEventListener('click', desincribirUsuario);
    } else {
        displayError("Lo lamentamos. Ya no hay cupo para el evento.");
    }
}

function desincribirUsuario(){
    console.log("Desinscribir");
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
        if (eventos){
            for (const key in eventos) {
                if (Object.hasOwnProperty.call(eventos, key)) {
                    const eventoInscrito = eventos[key];
                    if (eventoInscrito === eventId){
                        inscrito = true;
                        break;
                    }
                };
            };
        }
        if (inscrito){
            inscribirButton.addEventListener('click', desincribirUsuario);
        } else {
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