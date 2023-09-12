import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';

const db = getDatabase(app)

function test() {


    const eventos = []; // Crear una lista de eventos

    const evento1 = new Evento(
        'Título del Evento 1',
        'https://i.ytimg.com/vi/M6bSnnjFjN4/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIHhACGAYgATgB&rs=AOn4CLAue1Qi0usKn_3yy0iCKvW0N2qQKA',
        'Nombre de la Asociación 1',
        'Fecha 1',
        'Capacidad 1',
        ['Categoria 1', 'Categoria 2', 'Categoria 3'],
        'Descripción del evento 1',
        'Requerimientos del evento 1',
        '00/00/00 01:00 am - 00/00/00 02:00 pm',
        '0/500',
        '../images/test.jpg',
        46,
    );

    const evento2 = new Evento(
        'Título del Evento 2',
        'https://i.ytimg.com/vi/S49Q20s_xKo/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDO4xsmWLWQyU7g0FOaLZakytjXuQ',
        'Nombre de la Asociación 2',
        'Fecha 2',
        'Capacidad 2',
        ['Categoria 1', 'Categoria 2', 'Categoria 3'],
        'Descripción del evento 2',
        'Requerimientos del evento 2',
        '00/00/00 01:00 am - 00/00/00 02:00 pm',
        '0/500',
        '../images/test.jpg',
        98,
    );

    const evento3 = new Evento(
        'Título del Evento 3',
        'https://i.ytimg.com/vi/x0xNtbD0FtE/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBCLyhAI5u2ln1E3ChuJcQo5A7MOg',
        'Nombre de la Asociación 3',
        'Fecha 3',
        'Capacidad 3',
        ['Categoria 1', 'Categoria 3'],
        'Descripción del evento 3',
        'Requerimientos del evento 3',
        '00/00/00 10:00 am - 00/00/00 12:00 pm',
        '250/500',
        '../images/test.jpg',
        60,
    );


    eventos.push(evento1);
    eventos.push(evento2);
    eventos.push(evento3);

    const eventosRef = ref(db, 'eventos'); // Reemplaza 'eventos' con el nombre de tu nodo en la base de datos

    eventos.forEach((evento) => {
        const newEventoRef = push(eventosRef); // Genera una referencia con ID automático
        set(newEventoRef, evento); // Sube el objeto evento a la base de datos
    });
}

const button = document.getElementById('button');;
button.addEventListener('click', test);