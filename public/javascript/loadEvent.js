import { getDatabase, ref, onValue, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js';

const db = getDatabase(app)

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('eventId');

const eventosRef = ref(db, 'eventos'); // Reemplaza 'eventos' con la ubicación correcta en tu base de datos

const eventoRef = child(eventosRef, eventId);

const container = document.getElementById('eventData');

onValue(eventoRef, (snapshot) => {
    const eventoData = snapshot.val();
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
