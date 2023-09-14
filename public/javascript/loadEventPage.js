import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';

const db = getDatabase(app)

const container = document.getElementById('container');

const eventosRef = ref(db, 'eventos'); // Reemplaza 'eventos' con la ubicación correcta en tu base de datos
onValue(eventosRef, (snapshot) => {
    container.innerHTML = "";
    const data = snapshot.val();
    if (data) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const eventoData = data[key];
                const evento = new Evento(
                    key,
                    eventoData.titulo,
                    eventoData.imagenSrc,
                    eventoData.nombreAsociacion,
                    eventoData.userAsociacion,
                    eventoData.fecha,
                    eventoData.capacidad,
                    eventoData.categorias,
                    eventoData.descripcion,
                    eventoData.requerimientos,
                    eventoData.fechaHorario,
                    eventoData.cupos,
                    eventoData.userSrc,
                    eventoData.rating,
                    eventoData.clicks
                );
                container.appendChild(evento.toHTML());
            }
        }
    } else {
        // No se encontraron eventos en la base de datos
    }
});

