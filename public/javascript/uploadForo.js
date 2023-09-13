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
    // Enviar mail
    //sendEmail()
    //SendMail();
}

function clearText() {
    // Contenido del textarea
    const mensaje = text.value;
    // Verifica si el mensaje no está vacío antes de procesarlo
    if (mensaje.trim() !== '') {
        text.value = '';
    }
}

// function SendMail(){
//     Email.send({
//       SecureToken : "7901068b-704c-4c23-864a-ae1ab6145053",
//       To : 'jfernandezs2004@gmail.com',
//       From : "jfernandezs2004@gmail.com",
//       Subject : "This is the subject",
//       Body : "And this is the body"
//   }).then(
//     message => alert(message)
//   );
// }

const button = document.getElementById('foroButton');
const text = document.getElementById('comentInput');

button.addEventListener('click', foroMsj);




