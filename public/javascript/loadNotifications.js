import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Notificacion from './Notificacion.js';

const db = getDatabase(app)

const notiContainer = document.getElementById('notiContainer');

const notiRef = ref(db, 'notificaciones'); // Referencia a este lugar de la database
onValue(notiRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const notiData = data[key];
                const notificacion = new Notificacion(
                    notiData.subject,
                    notiData.message,
                    notiData.date,
                    notiData.imageUrl,
                );
                notiContainer.appendChild(notificacion.toHTML());
            }
        }

    } else {
        // No se encontraron eventos en la base de datos
    }

});