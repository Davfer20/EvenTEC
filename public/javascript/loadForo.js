import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Comentario from './Comentario.js';

const db = getDatabase(app)

const foroContainer = document.getElementById('comentContainer');

const foroRef = ref(db, 'foro'); // Referencia a este lugar de la database
onValue(foroRef, (snapshot) => { 
    const data = snapshot.val();
    if (data) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const foroData = data[key];
                console.log(foroData);
                const foro = new Comentario(
                  foroData.texto,
                  foroData.nombreUsuario,
                  foroData.fecha,
                  foroData.imageUrl,
                );
                foroContainer.appendChild(foro.toHTML());
                
            }
        }

    } else {
        // No se encontraron eventos en la base de datos
    }

});