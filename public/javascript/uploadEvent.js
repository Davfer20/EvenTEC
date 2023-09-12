import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js'

const containerAct = document.getElementById('container');


const db = getDatabase(app)

function test() {

    let eventos

    const eventosRef = ref(db, 'eventos');
    eventos.forEach((evento) => {
        const newEventoRef = push(eventosRef); // Genera una referencia con ID automático
        set(newEventoRef, evento); // Sube el objeto evento a la base de datos
    });
}

const button = document.getElementById('button');;
button.addEventListener('click', test);


function test2() {

    // Obtén una referencia al nodo del evento
    const eventoRef = ref(db, `eventos/-Ne5qi1sYPj9eczT4_lM/activities`); // Reemplaza "evento1" con el nombre del evento

    // Define los datos de la nueva actividad
    const nuevaActividad = new Actividad(
        "Curso Discord",
        "https://i.ytimg.com/vi/l7XZmNvFhds/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDgHwX6SChzghS6HYQSBOVM-PGnZw",
        "https://yt3.ggpht.com/_zvcSOCbAQ9DFRs6CnCAteiS7_aaWMfT9i4aOr9sG0Dvky0hoWle9pCaao5FFT5a9PWiTma_Kg=s68-c-k-c0x00ffffff-no-rj",
        "Raul",
        "00/00/00 11:00 am",
    )

    const newActivityRef = push(eventoRef); // Genera una referencia con ID automático
    set(newActivityRef, nuevaActividad); // Sube el objeto evento a la base de datos

}

function test3() {

    // Obtén una referencia al nodo del evento
    const eventoRef = ref(db, `eventos/-Ne5qi1sYPj9eczT4_lM/activities`); // Reemplaza "evento1" con el nombre del evento

    // Define los datos de la nueva actividad
    const nuevaActividad = new Actividad(
        "Curso Discord",
        "https://i.ytimg.com/vi/l7XZmNvFhds/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDgHwX6SChzghS6HYQSBOVM-PGnZw",
        "https://yt3.ggpht.com/_zvcSOCbAQ9DFRs6CnCAteiS7_aaWMfT9i4aOr9sG0Dvky0hoWle9pCaao5FFT5a9PWiTma_Kg=s68-c-k-c0x00ffffff-no-rj",
        "Raul",
        "00/00/00 11:00 am",
    )

    const newActivityRef = push(eventoRef); // Genera una referencia con ID automático
    set(newActivityRef, nuevaActividad); // Sube el objeto evento a la base de datos

}


function addActivityBox() {

    const buttonColumn = document.getElementById('add');
    const nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'column';
    nuevoElemento.innerHTML = `
        <input class="image" type="file"></input>
        <input class="title activity" type="text" placeholder="Titulo de la Actividad" required>
        <div class="user">
        <img src="../images/test.jpg" alt="Usuario">
        <div class="eventDetail">
            <input placeholder="Moderador"></input>
            <input type="datetime-local" placeholder="Rango de fecha"></input>
        </div>
        </div> 
    `;
    containerAct.insertBefore(nuevoElemento, buttonColumn);

}

function removeActivityBox() {

    if (containerAct.childElementCount >= 2) {
        // Accede al penúltimo elemento hijo (index - 2)
        const penultimoElemento = containerAct.children[containerAct.childElementCount - 2];
        // Elimina el penúltimo elemento
        penultimoElemento.remove();
    } else {

    }
}

const buttonAdd = document.getElementById('addActivity');
buttonAdd.addEventListener('click', addActivityBox);

const buttonDel = document.getElementById('delActivity');
buttonDel.addEventListener('click', removeActivityBox);

