import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Comentario from './Comentario.js';

const db = getDatabase(app)

function foroMsj() {

    var currentDate = new Date();
    const comentario = document.getElementById('comentInput').value;
    console.log(comentario);

    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const foroMsj = new Comentario(
        comentario,
        userInfo.username,
        `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`,
        'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    );

    const foroRef = ref(db, 'foro');
    const newForoRef = push(foroRef); // Genera una referencia con ID automático
    set(newForoRef, foroMsj);

    clearText();

}

function clearText() {
    // Contenido del textarea
    const mensaje = text.value;
    if (mensaje.trim() !== '') {
        text.value = '';
    }
}

const button = document.getElementById('foroButton');
const text = document.getElementById('comentInput');

button.addEventListener('click', foroMsj);
