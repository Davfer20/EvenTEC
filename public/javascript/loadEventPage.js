import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import sendMailBody from "./sendMailBody.js";
import uploadNotif from "./uploadNotifications.js";

const db = getDatabase(app)

const container = document.getElementById('container');

const eventosRef = await ref(db, 'eventos'); // Reemplaza 'eventos' con la ubicación correcta en tu base de datos
onValue(eventosRef, (snapshot) => {
    container.innerHTML = "";
    const data = snapshot.val();
    if (data) {
        for (const key in data) { // Por cada evento crea un evento con el constructor con toda la información requerida
            if (Object.hasOwnProperty.call(data, key)) {
                const eventoData = data[key];
                const evento = new Evento(
                    key,
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
                container.appendChild(evento.toHTML());
            }
        }
    } else {
        // No se encontraron eventos en la base de datos
    }
    checkDates();
});

// Envia mensajes para los recordatorios de cuando faltan 3 horas para subir el evento, modificar cupos o sin cupos
async function checkDates(){
    console.log("here");
    const listaFechas = document.querySelectorAll(".fechaEvento");
    console.log(listaFechas);
    const usersSnap = await get(ref(db, 'users'));
    let users;
    if (usersSnap.exists()){
        users = usersSnap.val()
    } else {
        return;
    }

    const inscritosSnap = await get(ref(db, 'inscritos'));
    let inscritos;
    if (inscritosSnap.exists()){
        inscritos = inscritosSnap.val();
    } else {
        return;
    }

    // Se toman los users y los inscritos

    console.log(users, inscritos);
    listaFechas.forEach(span => { // Ahora recorre todas las listas de fechas de eventos
        const eventId = span.id;
        const dateParts = span.innerHTML;
        const fecha1 = new Date(dateParts); // Fecha del evento
        const fecha2 = new Date(); // Fecha actual
        const value = (calcularDistanciaEnMinutos(fecha1, fecha2)) ; // Calcula diferencia de horas con un rango
        if (value > 170 && value <180){
            uploadNotif("Recordatorio", "Un evento iniciará en 3 horas."); // Recordatorio
            for (const evento in inscritos){
                for (const user in inscritos[evento]){
                    console.log(user);
                    if (inscritos[evento][user]){
                        console.log(users[user]);
                        const email = users[user]['email'];
                        console.log(email); // sendMailBody es una plantilla para envir recordatorios
                        sendMailBody("EvenTEC Corporation", "Su evento iniciará en 3 horas", email);
                        console.log("emailSent");
                        // Se confirmae en consola que se mando
                    }
                    
                }
            }
        }
    });
}

// Funcion par calcular la diferencia de tiempo 
function calcularDistanciaEnMinutos(fecha1, fecha2) {
    const milisegundosPorMinuto = 60 * 1000;
  
    const fecha1Timestamp = fecha1.getTime();
    const fecha2Timestamp = fecha2.getTime();
    const diferenciaEnMilisegundos = (fecha1Timestamp - fecha2Timestamp);

    return (diferenciaEnMilisegundos / milisegundosPorMinuto);

}

// Para el gmail
setInterval(checkDates, 600000); // Revisa cada 10 min

