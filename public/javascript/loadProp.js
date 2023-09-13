import { getDatabase, set, get, ref, onValue, child, push, remove } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js';


const db = getDatabase(app)

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('eventId');

const eventosRef = ref(db, 'propuestas'); // Reemplaza 'eventos' con la ubicación correcta en tu base de datos

const eventoRef = child(eventosRef, eventId);
const container = document.getElementById('eventData');

const colabsRef = child(eventoRef, 'colabs');
const footer = document.getElementById('footer');

let eventoData;

await get(eventoRef).then((snapshot) => {
    eventoData = snapshot.val();
    console.log(eventosRef);
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
        console.log("evento loaded");
    } else {
        // Maneja el caso en el que no se encuentre el evento
        console.log('Evento no encontrado');
    }
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

document.getElementById('inscribirButton').addEventListener('click', function () {
    let eventosRef = ref(db, 'eventos');
    let newEventoRef = push(eventosRef);
    set(newEventoRef, eventoData);

    remove(eventoRef)

});

verListButton.remove();
inscribirButton.innerHTML = 'Validar';


