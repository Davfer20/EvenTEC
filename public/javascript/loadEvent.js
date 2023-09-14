import { getDatabase, get, ref, onValue, child, update, runTransaction, orderByValue, query } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js';
import Rating from "./Rating.js";
import sendMail from "./sendMail.js";


const db = getDatabase(app)

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('eventId');

const eventosRef = ref(db, 'eventos'); // Reemplaza 'eventos' con la ubicación correcta en tu base de datos

const eventoRef = child(eventosRef, eventId);
const container = document.getElementById('eventData');
const informeEvento = document.getElementById('informeEvento');
const type = parseInt(localStorage.getItem('type'));

const colabsRef = child(eventoRef, 'colabs');
const footer = document.getElementById('footer');
let cupos = 0;
let capacidad = 0;

let creatorAsociacion;

function incrementClicks(eventId) {
    runTransaction(ref(db, `/eventos/${eventId}/clicks`), (clicks) => {
        if (clicks) {
            return clicks + 1;
        } else {
            return 1;
        }
    });
}

incrementClicks(eventId);
await get(eventoRef).then((snapshot) => {
    const eventoData = snapshot.val();
    console.log(eventoData);
    if (eventoData) {
        const evento = new Evento(
            eventId,
            eventoData.titulo,
            eventoData.imagenSrc,
            eventoData.nombreAsociacion,
            eventoData.userAsociacion,
            eventoData.fecha,
            eventoData.capacidad,
            eventoData.categorias,
            eventoData.descripcion,
            eventoData.requerimientos,
            eventoData.fechaHorario,
            eventoData.cupos,
            eventoData.userSrc,
            eventoData.rating,
            eventoData.clicks
        );
        container.appendChild(evento.toExtendedHTML())
        const colabHTML = document.createElement('div');
        colabHTML.className = 'colabs';
        colabHTML.innerHTML = `
        <img src="${eventoData.userSrc}" alt="Usuario">
        <span>${eventoData.nombreAsociacion}</span>
        `;
        footer.appendChild(colabHTML)
        cupos = eventoData.cupos;
        capacidad = eventoData.capacidad;
        if (type) {
            creatorAsociacion = eventoData.userAsociacion;
            informeEvento.appendChild(evento.toInformeHTML());
        }
        console.log("evento loaded");

    } else {
        // Maneja el caso en el que no se encuentre el evento
        console.log('Evento no encontrado');
    }
});

function getTimestamp() {
    const date = new Date();

    // obtenemos el dia, mes y año, horas minutos y segudndos, y
    // los formateamos para que queden en formato
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function inscribirUsuario() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const loggedUser = userInfo['carnet'];
    const email = userInfo['email'];
    console.log(loggedUser, cupos, capacidad);
    if (cupos < capacidad) {
        const updates = {};
        updates[`/inscritos/${eventId}/` + loggedUser] = getTimestamp();
        updates[`/userEventos/${loggedUser}/` + eventId] = true;
        updates[`/eventos/${eventId}/cupos`] = cupos + 1;
        update(ref(db), updates);
        displayMessage("Éxito", "¡Felicitaciones, ha sido inscrito al evento! Revise su correo.");

        sendMail('EvenTEC Corporation', 'WERTY31678D32S', email);
        inscribirButton.removeEventListener('click', inscribirUsuario);
        inscribirButton.textContent = "Cancelar";
        inscribirButton.addEventListener('click', desinscribirUsuario);
    } else {
        displayError("Lo lamentamos. Ya no hay cupo para el evento.");
    }
}

function desinscribirUsuario() {
    const cancelContainer = document.querySelector('.cancelContainer');
    cancelContainer.style.opacity = 1;
    cancelContainer.style.zIndex = 1;
}

async function confirmCancel() {
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"))["carnet"];
    const updates = {};
    updates[`/inscritos/${eventId}/` + loggedUser] = false;
    updates[`/userEventos/${loggedUser}/` + eventId] = false;
    updates[`/eventos/${eventId}/cupos`] = cupos - 1;
    update(ref(db), updates);
    displayMessage("Éxito", "Se ha desinscrito del evento.");
    inscribirButton.removeEventListener('click', desinscribirUsuario);
    inscribirButton.textContent = "Inscribirme";
    inscribirButton.addEventListener('click', inscribirUsuario);
    const cancelContainer = document.querySelector('.cancelContainer');
    cancelContainer.style.opacity = 0;
    cancelContainer.style.zIndex = -1;
}

function cancelCancel() {
    const cancelContainer = document.querySelector('.cancelContainer');
    cancelContainer.style.opacity = 0;
    cancelContainer.style.zIndex = -1;
}


function displayMessage(title, message) {
    const errorTitle = document.querySelector('.errorTitle');
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 1;
    errorContainer.style.zIndex = 1;

    errorTitle.textContent = title;
    const errorText = document.querySelector('.errorText');
    errorText.textContent = message;
}

function displayError(error) {
    const errorTitle = document.querySelector('.errorTitle');
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 1;
    errorContainer.style.zIndex = 1;

    errorTitle.textContent = "Alerta";
    const errorText = document.querySelector('.errorText');
    errorText.textContent = error;
}

function closeError() {
    const errorContainer = document.querySelector('.errorContainer');
    errorContainer.style.opacity = 0;
    errorContainer.style.zIndex = -1;
}

async function actualizarInforme() {
    const cuposEventPage = document.getElementById("cuposEventPage");
    cuposEventPage.innerHTML = `Cupos: ${cupos}/${capacidad}`;
    const porcentajeAsistencia = document.getElementById("porcentajeAsistencia");
    porcentajeAsistencia.innerHTML = `Porcentaje de asistencia: ${Math.round(cupos / capacidad * 10000) / 100}%`;

    const listaInscritos = document.getElementById('listaInscritos');

    const rowsInscritos = listaInscritos.querySelectorAll("td");
    console.log(rowsInscritos);
    rowsInscritos.forEach((row) => {
        console.log(row);
        row.remove();
    })

    const usersSnap = await get(ref(db, 'users'));
    const inscritosSnap = await get(ref(db, `inscritos/${eventId}`));

    const carreras = {};
    let cancelaciones = 0;
    if (usersSnap.exists() && inscritosSnap.exists()) {
        const users = usersSnap.val();
        const inscritos = inscritosSnap.val();
        for (const user in inscritos) {
            if (!inscritos[user]) {
                cancelaciones += 1;
                continue;
            }
            console.log(user)
            const newRow = listaInscritos.insertRow();
            const nombre = newRow.insertCell(0);
            nombre.innerHTML = users[user]["username"];
            const carnet = newRow.insertCell(1);
            carnet.innerHTML = users[user]["carnet"];
            const correo = newRow.insertCell(2);
            correo.innerHTML = users[user]["email"];
            correo.className = "correoElement";
            const telefono = newRow.insertCell(3);
            telefono.innerHTML = users[user]["phone"];
            const carrera = newRow.insertCell(4);
            carrera.innerHTML = users[user]["carrera"];
            const sede = newRow.insertCell(5);
            sede.innerHTML = users[user]["sede"];
            const fecha = newRow.insertCell(6);
            fecha.innerHTML = inscritos[user];
            if (carreras.hasOwnProperty(users[user]["carrera"])) {
                carreras[users[user]["carrera"]] += 1;
            } else {
                carreras[users[user]["carrera"]] = 1;
            }
        }
    }
    const estudiantesCarreras = document.getElementById('estudiantesCarreras');
    const rowsCarreras = estudiantesCarreras.querySelectorAll("td");
    console.log(rowsCarreras);
    rowsCarreras.forEach((row) => {
        console.log(row);
        row.remove();
    })
    for (const carrera in carreras) {
        const newRow = estudiantesCarreras.insertRow();
        const nombre = newRow.insertCell(0);
        nombre.innerHTML = carrera;
        const cantidad = newRow.insertCell(1);
        cantidad.innerHTML = carreras[carrera];
    }

    const cancelacionesText = document.getElementById('cancelaciones');
    cancelacionesText.innerHTML = `Cantidad de cancelaciones: ${cancelaciones}`;
}

function abrirInforme() {
    informeEvento.style.zIndex = 1;
    informeEvento.style.opacity = 1;
    actualizarInforme();
}

function cerrarInforme() {
    informeEvento.style.zIndex = -1;
    informeEvento.style.opacity = 0;
}

const errorButton = document.querySelector('.errorButton');
errorButton.addEventListener('click', closeError);

const confirmCanButton = document.getElementById('confirmCanButton');
confirmCanButton.addEventListener('click', confirmCancel);

const cancelCanButton = document.getElementById('cancelCanButton');
cancelCanButton.addEventListener('click', cancelCancel);
console.log("here");
const inscribirButton = document.getElementById('inscribirButton');

const verListButton = document.getElementById('verListButton');

if (type === 0) {
    verListButton.remove();
    informeEvento.remove();
    let inscrito = false;
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"))["carnet"];
    get(ref(db, `userEventos/${loggedUser}`)).then((snapshot) => {
        const eventos = snapshot.val();
        console.log(loggedUser, eventos);
        if (eventos) {
            for (const key in eventos) {
                if (Object.hasOwnProperty.call(eventos, key)) {
                    console.log(eventos[key]);
                    if (key === eventId && eventos[key]) {
                        inscrito = true;
                        break;
                    }
                };
            };
        }
        if (inscrito) {
            inscribirButton.textContent = "Cancelar";
            inscribirButton.addEventListener('click', desinscribirUsuario);
        } else {
            inscribirButton.textContent = "Inscribirme";
            inscribirButton.addEventListener('click', inscribirUsuario);
        }
    });
} else if (type === 1) {
    inscribirButton.remove();
    if (creatorAsociacion === JSON.parse(localStorage.getItem("userInfo"))["username"]) {
        verListButton.addEventListener('click', abrirInforme);
        const cerrarInformeButton = document.getElementById('cerrarInformeButton');
        cerrarInformeButton.addEventListener('click', cerrarInforme);
    } else {
        verListButton.remove();
    }
} else {
    inscribirButton.remove();
    if (creatorAsociacion === JSON.parse(localStorage.getItem("userInfo"))["asociacion"]) {
        verListButton.addEventListener('click', abrirInforme);
        const cerrarInformeButton = document.getElementById('cerrarInformeButton');
        cerrarInformeButton.addEventListener('click', cerrarInforme);
    } else {
        verListButton.remove();
    }
}

onValue(child(eventoRef, 'cupos'), (snapshot) => {
    console.log("cupos");
    console.log(snapshot.val());
    cupos = snapshot.val();
    const cuposEventPage = document.getElementById("cuposEventPage");
    cuposEventPage.textContent = `Cupos: ${cupos}/${capacidad}`;
});

onValue(child(eventoRef, 'capacidad'), (snapshot) => {
    console.log("capacidad");
    console.log(snapshot.val());
    capacidad = snapshot.val();
    const cuposEventPage = document.getElementById("cuposEventPage");
    cuposEventPage.textContent = `Cupos: ${cupos}/${capacidad}`;
});

const activitiesRef = child(eventoRef, 'activities');
const containerA = document.getElementById('container');



const comment = document.getElementById('commentRate');
const containerR = document.getElementById('rateContainer');

onValue(activitiesRef, (snapshot) => {
    const activitiesData = snapshot.val();
    if (activitiesData) {
        for (const key in activitiesData) {
            if (Object.hasOwnProperty.call(activitiesData, key)) {
                const activitiyData = activitiesData[key];
                const actividad = new Actividad(
                    activitiyData.titulo,
                    activitiyData.imagenSrc,
                    activitiyData.userSrc,
                    activitiyData.nombreModerador,
                    activitiyData.fecha
                );


                containerR.insertBefore(CreateRatingHTML(activitiyData.titulo), comment);
                containerA.appendChild(actividad.toHTML());
            };
        };
    } else {
        // Maneja el caso en el que no se encuentre el evento
        console.log('Actividad no encontrado');
    }
});

onValue(colabsRef, (snapshot) => {
    const colabsData = snapshot.val();
    console.log(colabsData);

    if (colabsData) {
        for (const i in colabsData) {
            const colabHTML = document.createElement('div');
            colabHTML.className = 'colabs';
            colabHTML.innerHTML = `
            <img src="../images/test.jpg" alt="Usuario">
            <span>${colabsData[i]}</span>
             `;

            footer.appendChild(colabHTML)

        };

    } else {
        // Maneja el caso en el que no se encuentre el evento
        console.log('Actividad no encontrado');
    }
});

//|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|        |////////////////////////////////|\\
//|////////////////////////////////| RATING |\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|\\
//|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|        |////////////////////////////////|\\

/*
let ratingValue;
*/

function openRateEmail() {
    const rateContainer = document.querySelector('.rateContainer');
    rateContainer.style.opacity = 1;
    rateContainer.style.zIndex = 1;
}

function closeRateEmail() {
    const rateContainer = document.querySelector('.rateContainer');
    rateContainer.style.opacity = 0;
    rateContainer.style.zIndex = -1;
}

function rateUpload() {
    console.log('Comienza upload');
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));

    console.log(eventId);
    console.log(userInfo.username);
    console.log(ratingValue);
    console.log(text.value);

    const rateEvent = new Rating(
        eventId,
        // [actividadKey,]
        // [rating,]
        userInfo.username,
        ratingValue, // useless
        text.value
    )

    const rateRed = ref(db, 'rating');
    const newForoRef = push(rateRed); // Genera una referencia con ID automático
    set(newForoRef, rateEvent);

    closeRateEmail()
}

const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', openRateEmail);


const sendButton2 = document.getElementById('sendButton2');
sendButton2.addEventListener('click', rateUpload);

const closeButton2 = document.getElementById('closeButton2');
closeButton2.addEventListener('click', closeRateEmail);



const text = document.getElementById('commentRate');

const ratingInputs = document.querySelectorAll('input[name="rating"]');

/*
ratingInputs.forEach(input => {
    input.addEventListener('change', function () {
        const selectedRating = document.querySelector('input[name="rating"]:checked');

        if (selectedRating) {
            ratingValue = selectedRating.value;
            console.log('Rating seleccionado:', ratingValue);
            // Puedes realizar las acciones que desees con el valor del rating aquí.
        } else {
        }
    });


});
*/

function CreateRatingHTML(value) {
    const ratingHTML = document.createElement('form');
    ratingHTML.id = 'ratingForm';

    ratingHTML.innerHTML = `
    <h3>${value}</h3>
    <label>
      <input type="radio" name="rating" value="1" class="ratingContianer">
      <span class="rating-number">1</span>
    </label>
    <label>
      <input type="radio" name="rating" value="2" class="ratingContianer">
      <span class="rating-number">2</span>
    </label>
    <label>
      <input type="radio" name="rating" value="3" class="ratingContianer">
      <span class="rating-number">3</span>
    </label>
    <label>
      <input type="radio" name="rating" value="4" class="ratingContianer">
      <span class="rating-number">4</span>
    </label>
    <label>
      <input type="radio" name="rating" value="5" class="ratingContianer">
      <span class="rating-number">5</span>
    </label>
    `;

    return ratingHTML
}
