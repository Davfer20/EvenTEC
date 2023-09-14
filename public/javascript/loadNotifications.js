import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Notificacion from './Notificacion.js';

const db = getDatabase(app)
// Esta funcion se encarga de que las notificaciones se vean en el html
const notiContainer = document.getElementById('notiContainer');

const notiRef = ref(db, 'notificaciones'); // Referencia a este lugar de la database
onValue(notiRef, (snapshot) => { //Toma los valores del firebase
    const data = snapshot.val();
    if (data) {
        for (const key in data) { // Va tomando notificacion por notificacion
            if (Object.hasOwnProperty.call(data, key)) {
                const notiData = data[key];
                const notificacion = new Notificacion( //Mete la info en la clase
                    notiData.subject,
                    notiData.message,
                    notiData.date,
                    notiData.imageUrl,
                );
                notiContainer.appendChild(notificacion.toHTML()); //Se llama a la función para hacerlo html
            }
        }
    } else {
        // No se encontraron eventos en la base de datos
    }
});