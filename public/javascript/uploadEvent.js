import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js'

const db = getDatabase(app)

const eventosRef = ref(db, 'eventos');
const newEventoRef = push(eventosRef) // Genera una referencia con ID automático


function test() {

    let eventos


    eventos.forEach((evento) => {


    });
}



function test2() {

    // Obtén una referencia al nodo del evento
    const eventoRef = ref(db, `eventos/${newEventoRef}/activities`); // Reemplaza "evento1" con el nombre del evento

    // Define los datos de la nueva actividad
    const nuevaActividad = new Actividad(
        "titulo de la actividad",
        "enlace de la imagen",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOW34PFNB2wJ1Hf5AP88UYB4d-LDcOsC7i4g&usqp=CAU", // dejalo hardcoded de momento 
        "nombre del moderador",
        "fecha del input",
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






function submitImage() {
    const imagen = inputImagenEvento.files[0];
    if (imagen) {
        // Crea un objeto FileReader para leer la imagen
        const reader = new FileReader();

        // Define una función para manejar la carga de la imagen
        reader.onload = function () {
            const imagenBase64 = reader.result; // Contiene la imagen en formato Base64

            console.log("URL de la imagen:", imagenBase64);

            const imagenMostrada = document.getElementById('image');
            imagenMostrada.src = imagenBase64;

        };

        // Lee la imagen como Base64
        reader.readAsDataURL(imagen);
    } else {
        // El usuario no seleccionó una imagen
        alert('Por favor, seleccione una imagen.');
    }
}


const inputImagenEvento = document.getElementById('eventImage')
inputImagenEvento.addEventListener('change', submitImage);


function subirTodasLasActividades() {




    //set(newEventoRef, evento); // Sube el objeto evento a la base de datos
    const eventoRef = ref(db, `eventos/${newEventoRef}/activities`);

    // Obtén una lista de todos los elementos de actividad en el contenedor
    const actividades = document.querySelectorAll('.column.act');

    // Recorre cada elemento de actividad y sube sus datos a Firebase
    actividades.forEach((actividad) => {
        const titulo = actividad.querySelector('.title.activity').value;
        const imagenPlaceholder = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOW34PFNB2wJ1Hf5AP88UYB4d-LDcOsC7i4g&usqp=CAU";
        const moderador = actividad.querySelector('.actMod').value;
        const fecha = actividad.querySelector('.actDate').value;
        const imagen = actividad.querySelector('.image').getAttribute('src')

        // Crea un objeto de actividad con los datos obtenidos
        const nuevaActividad = new Actividad(
            titulo,
            imagen,
            imagenPlaceholder, // Por ahora, coloca una imagen de marcador de posición
            moderador,
            fecha
        );

        console.log(nuevaActividad)
        // Genera una referencia con ID automático para la nueva actividad
        const newActivityRef = push(eventoRef);
        // Sube el objeto de actividad a la base de datos
        set(newActivityRef, nuevaActividad);

    });
}

const submitButton = document.getElementById('buttonSubmit')
submitButton.addEventListener('click', subirTodasLasActividades);
