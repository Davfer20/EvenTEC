import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js'

const db = getDatabase(app)

const eventosRef = ref(db, 'eventos');
const newEventoRef = push(eventosRef) // Genera una referencia con ID automático




function submitEvento() {
    const item = document.getElementById('eventData')
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const titulo = item.querySelector('.title').value;
    const imagenSrc = item.querySelector('.image').getAttribute('src')
    const nombreAsociacion = userInfo.username;
    const fecha = item.querySelector('.startDate').value;
    const fechaHorario = `${item.querySelector('.startDate').value} - ${item.querySelector('.endDate').value}`;
    const capacidad = item.querySelector('.capacity').value;
    const descripcion = item.querySelector('.description').value;
    const requerimientos = item.querySelector('.requirements').value;
    const cupos = '0/' + capacidad;
    const userSrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOW34PFNB2wJ1Hf5AP88UYB4d-LDcOsC7i4g&usqp=CAU";
    const inputCategories = item.querySelectorAll('.cat');

    let categorias = []
    inputCategories.forEach((inputElement) => {
        const categoria = inputElement.value;
        if (categoria) {
            categorias.push(categoria);
        }
    });

    let nuevoEvento = new Evento(
        newEventoRef.key,
        titulo,
        imagenSrc,
        nombreAsociacion,
        fecha,
        capacidad,
        categorias,
        descripcion,
        requerimientos,
        fechaHorario,
        cupos,
        userSrc,
        5,
    )

    set(newEventoRef, nuevoEvento); // Sube el objeto evento a la base de datos
    subirTodasLasActividades()
}

function subirTodasLasActividades() {

    const eventoRef = ref(db, `eventos/${newEventoRef.key}/activities`);

    // Obtén una lista de todos los elementos de actividad en el contenedor
    const actividades = document.querySelectorAll('.column.act');

    // Recorre cada elemento de actividad y sube sus datos a Firebase
    actividades.forEach((actividad) => {
        const titulo = actividad.querySelector('.title.activity').value;
        const imagenPlaceholder = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOW34PFNB2wJ1Hf5AP88UYB4d-LDcOsC7i4g&usqp=CAU";
        const moderador = actividad.querySelector('.actMod').value;
        const fecha = actividad.querySelector('.actDate').value;
        const imagen = actividad.querySelector('.image').getAttribute('src');

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
submitButton.addEventListener('click', submitEvento);


function submitImage() {
    const imagen = inputImagenEvento.files[0];
    if (imagen) {
        // Crea un objeto FileReader para leer la imagen
        const reader = new FileReader();

        // Define una función para manejar la carga de la imagen
        reader.onload = function () {
            const imagenBase64 = reader.result; // Contiene la imagen en formato Base64



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
