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
        for (const key in data) {
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

// Prueba para enviar correos
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

    console.log(users, inscritos);
    listaFechas.forEach(span => {
        const eventId = span.id;
        const dateParts = span.innerHTML;
        const fecha1 = new Date(dateParts);
        const fecha2 = new Date(); 
        const value = (calcularDistanciaEnMinutos(fecha1, fecha2)) ;
        if (value > 170 && value <180){
            uploadNotif("Recordatorio", "Un evento iniciará en 3 horas.");
            for (const evento in inscritos){
                for (const user in inscritos[evento]){
                    console.log(user);
                    if (inscritos[evento][user]){
                        console.log(users[user]);
                        const email = users[user]['email'];
                        console.log(email);
                        sendMailBody("EvenTEC Corporation", "Su evento iniciará en 3 horas", email);
                        console.log("emailSent");
                    }
                    
                }
            }
        }
    });
}

function calcularDistanciaEnMinutos(fecha1, fecha2) {
    const milisegundosPorMinuto = 60 * 1000;
  
    const fecha1Timestamp = fecha1.getTime();
    const fecha2Timestamp = fecha2.getTime();
    const diferenciaEnMilisegundos = (fecha1Timestamp - fecha2Timestamp);

    return (diferenciaEnMilisegundos / milisegundosPorMinuto);

}

// Para el gmail
setInterval(checkDates, 600000); // 60000 ms = 1 minuto

