import { getDatabase, get, ref, onValue, child, update, runTransaction, orderByValue, query, push, remove } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import Actividad from './Actividad.js';
import Rating from "./Rating.js";
import sendMail from "./sendMail.js";
import Comentario from './Comentario.js';
import uploadNotif from "./uploadNotifications.js";

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

let eventTitle;

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
        eventTitle = eventoData.titulo;
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

        sendMail('EvenTEC Corporation', `${eventId}${loggedUser}`, email);
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

    const ratingInforme = document.getElementById('ratingInforme');
    const ratingSnap = await get(ref(db, `ratings/${eventId}`));
    let ratings = {};
    if (ratingSnap.exists()){
        ratings = ratingSnap.val();
        const ratingGeneral = ratings["Evento en general"];
        console.log(ratingGeneral);
        ratingInforme.innerHTML = `Rating: ${ratingGeneral['suma']/ratingGeneral['cantidad']}`;
    } else {
        ratingInforme.innerHTML = "Rating: No hay ratings";
    }

    const cantidadComentarios = document.getElementById("cantidadComentarios");
    const comentariosSnap = await get(ref(db, `comments/${eventId}`));
    let comments = {};
    if (comentariosSnap.exists()){
        comments = comentariosSnap.val();
        const cantidadCom = Object.keys(comments).length;
        console.log("Cantidad comentarios", cantidadCom);
        cantidadComentarios.innerHTML = `Cantidad de comentarios: ${cantidadCom}`;
    }

    const comentariosSubtitle = document.getElementById('comentariosSubtitle');
    const informeContent = document.getElementById('informeContent');
    for (const actividad in ratings){
        const actividadRatingHTML = document.createElement('div');
        actividadRatingHTML.className = "info";

        actividadRatingHTML.innerHTML = `<p style="text-align: left"><strong>${actividad}:</strong>  ${ratings[actividad]["suma"]/ratings[actividad]["cantidad"]}  con ${ratings[actividad]["suma"]} ratings.</p>`;
        informeContent.insertBefore(actividadRatingHTML, comentariosSubtitle);
    }
    
    const comentariosDiv = document.getElementById('comentariosDiv');
    for (const comentario in comments){
        const comentarioObj = new Comentario(
            comments[comentario]["comment"],
            comments[comentario]["userInfo"],
            comments[comentario]['timestamp']
        );
        comentariosDiv.appendChild(comentarioObj.toHTMLInforme());
        // const actividadRatingHTML = document.createElement('div');
        // actividadRatingHTML.className = "info";

        // actividadRatingHTML.innerHTML = `<p style="text-align: left"><strong>${actividad}:</strong>  ${ratings[actividad]["suma"]/ratings[actividad]["cantidad"]}  con ${ratings[actividad]["suma"]} ratings.</p>`;
        // informeContent.insertBefore(actividadRatingHTML, comentariosSubtitle);
    }
    

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
const delButton = document.getElementById('delButton')


const verListButton = document.getElementById('verListButton');

if (type === 0) {
    verListButton.remove();
    informeEvento.remove();
    delButton.remove();
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
        delButton.remove();
    }
} else {
    inscribirButton.remove();
    delButton.remove();
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
    if (cupos == capacidad){
        uploadNotif(eventTitle, "Se acabaron los cupos.");
    }
});

onValue(child(eventoRef, 'capacidad'), (snapshot) => {
    console.log("capacidad");
    console.log(snapshot.val());
    capacidad = snapshot.val();
    const cuposEventPage = document.getElementById("cuposEventPage");
    cuposEventPage.textContent = `Cupos: ${cupos}/${capacidad}`;
    uploadNotif(eventTitle, "Se modificó la capacidad.");
});

const activitiesRef = child(eventoRef, 'activities');
const containerA = document.getElementById('container');



let comment = document.getElementById('commentRate');
const containerR = document.getElementById('rateContainer');

onValue(activitiesRef, (snapshot) => {
    containerR.innerHTML = `<p class="titleRateEvent">Calificar un evento</p>
    <p class="rateEvent">Ingrese del 1 al 5 su satisfacción</p>

    <textarea id="commentRate" placeholder="Escribe un comentario" class="coment-rate" rows="5" cols="54"></textarea>
    <button class="buttonR1" id="sendButton2">Enviar</button>
    <button class="buttonR1" id="closeButton2">Cerrar</button>`;
    comment = document.getElementById('commentRate');
    const sendButton2 = document.getElementById('sendButton2');
    sendButton2.addEventListener('click', rateUpload);

    const closeButton2 = document.getElementById('closeButton2');
    closeButton2.addEventListener('click', closeRateEmail);
    containerR.insertBefore(CreateRatingHTML('Evento en general'), comment);

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

async function rateUpload() {
    console.log('Comienza upload');
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const resultsActivities = document.querySelectorAll("form");
    const text = document.getElementById('commentRate');


    const results = {};

    resultsActivities.forEach((form) => {
        console.log(form.id);
        const titleHead = form.querySelector("h3");
        const title = titleHead.innerHTML;
        const selected = form.querySelector('input[name=rating]:checked');
        console.log(title, selected.value);
        results[title] = parseInt(selected.value);
    });
    console.log(results);
    
    console.log(eventId);
    console.log(userInfo.username);
    console.log(text.value);

    const actividadRef = ref(db, `ratings/${eventId}`);
    const snapshot = await get(actividadRef);
    let actividades = {};
    let newItem = {};
    if (snapshot.exists()) {
        actividades = snapshot.val();
        for (const key in results){
            if (actividades.hasOwnProperty(key)){
                actividades[key]["suma"] += results[key];
                actividades[key]["cantidad"] += 1;
            } else {
                newItem = {
                    "suma": results[key],
                    "cantidad": 1
                }
                actividades[key] = newItem;
            }
        }
    } else {
        for (const key in results){
            newItem = {
                "suma": results[key],
                "cantidad": 1
            }
            actividades[key] = newItem;
        }
    }
    console.log(actividades);

    set(actividadRef, actividades);

    if (text.value != ""){
        const commentRef = ref(db, `comments/${eventId}`);
        const newCommentRef = push(commentRef);
        set(newCommentRef, {
            "comment": text.value,
            "userInfo": userInfo.username,
            "eventId": eventId,
            "timestamp": getTimestamp()
        })
    }
    closeRateEmail()
}

const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', openRateEmail);

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
    ratingHTML.id = `${value}Form`;

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
      <input type="radio" name="rating" value="3" class="ratingContianer" checked>
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


//|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|        |////////////////////////////////|\\
//|////////////////////////////////| Borrar |\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|\\
//|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|        |////////////////////////////////|\\



function deleteAccount() {
    const deleteContainer = document.querySelector('.deleteContainer');
    deleteContainer.style.opacity = 1;
    deleteContainer.style.zIndex = 1;
}

async function confirmDelete() {

    await remove(ref(db, `eventos/${eventId}`));

    window.location.href = "./eventPage.html";
}

function cancelDelete() {
    const deleteContainer = document.querySelector('.deleteContainer');
    deleteContainer.style.opacity = 0;
    deleteContainer.style.zIndex = -1;
}

const eliminarProfileButton = document.getElementById('delButton');
eliminarProfileButton.addEventListener('click', deleteAccount);

const confirmDelButton = document.getElementById('confirmDelButton');
confirmDelButton.addEventListener('click', confirmDelete);

const cancelDelButton = document.getElementById('cancelDelButton');
cancelDelButton.addEventListener('click', cancelDelete);