import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Notificacion from './Notificacion.js';

const db = getDatabase(app)

function test2() {

    const notificaciones = []; 

    const noti1 = new Notificacion(
        'Notificacion 1',
        'Esta es una prueba nada mas',
        '10/04/23',
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    const noti2 = new Notificacion(
        'Notificacion 2',
        'Esta es una prueba nada mas',
        '10/04/23',
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    const noti3 = new Notificacion(
        'Notificacion 3',
        'Esta es una prueba nada mas',
        '10/04/23',
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    notificaciones.push(noti1);
    notificaciones.push(noti2);
    notificaciones.push(noti3); 

    const notiRef = ref(db, 'notificaciones'); // Reemplaza 'eventos' con el nombre de tu nodo en la base de datos

    notificaciones.forEach((notificacion) => {
        const newNotiRef = push(notiRef); // Genera una referencia con ID automático
        set(newNotiRef, notificacion); // Sube el objeto evento a la base de datos
    });
}
//test2();

function uploadNotif(title, content){

    const currentDate = new Date();


    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    // Create the formatted date string
    const date = `${month}/${day}/${year}`;

    const noti = new Notificacion(
        title,
        content,
        date,
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    const notiRef = ref(db, 'notificaciones'); // Reemplaza 'eventos' con el nombre de tu nodo en la base de datos

    const newNotiRef = push(notiRef); // Genera una referencia con ID automático
    set(newNotiRef, noti); // Sube el objeto evento a la base de datos
}

export default uploadNotif;