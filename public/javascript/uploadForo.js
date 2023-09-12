import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Comentario from './Comentario.js';

const db = getDatabase(app)

function test3() {

    const mensajesForo = []; 

    const msj1 = new Comentario(
        'Comentario 1',
        'User 1',
        '10/04/23',
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    const msj2 = new Comentario(
        'Comentario 2',
        'User 2',
        '10/04/23',
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    let msj3 = new Comentario(
        'Comentario 3',
        'User 3',
        '10/04/23',
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    mensajesForo.push(msj1);
    mensajesForo.push(msj2);
    mensajesForo.push(msj3); 

    const foroRef = ref(db, 'foro'); // Reemplaza 'foro' con el nombre de tu nodo en la base de datos

    mensajesForo.forEach((comentario) => {
        console.log(comentario);
        const newForoRef = push(foroRef); // Genera una referencia con ID automático
        set(newForoRef, comentario); // Sube el objeto evento a la base de datos
    });
    
}

function foroMsj(){

    var currentDate = new Date();
    const comentario = document.getElementById('comentInput').value;
    console.log(comentario);

    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const foroMsj = new Comentario(
        comentario,
        userInfo.username,
        `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`,
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    const foroRef = ref(db, 'foro');
    const newForoRef = push(foroRef); // Genera una referencia con ID automático
    set(newForoRef, foroMsj);
}

const button = document.getElementById('foroButton');;
button.addEventListener('click', foroMsj);

