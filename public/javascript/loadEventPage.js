import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Evento from './Evento.js';
import sendMail from "./sendMail.js";


const db = getDatabase(app)

const container = document.getElementById('container');

const eventosRef = ref(db, 'eventos'); // Reemplaza 'eventos' con la ubicación correcta en tu base de datos
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
});

// Prueba para enviar correos
async function checkDates(){
    const listaFechas = document.querySelectorAll(".fechaEvento");
    
    const usersSnap = await get(ref(db, 'users'));
    let users = usersSnap.val();

    const inscritosSnap = await get(ref(db, 'users'));
    let inscritos = inscritosSnap.val();


    listaFechas.forEach(span => {
        const eventID = span.id;
        const dateParts = span.innerHTML;
        const fecha1 = new Date(dateParts);
        const fecha2 = new Date(); 
        const value = (calcularDistanciaEnMinutos(fecha1, fecha2)) ;
        if (value > 170 && value <180){
            
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const loggedUser = userInfo['carnet'];
            const email = userInfo['email'];
            sendMail('EvenTEC Corporation', 'WERTY31678D32S', email);
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

function ejecutarFuncion() {

    console.log("La función se ha llamado bien");
  }

function comprobarHora() {
    console.log("La función se ha ejecutado a la hora deseada.");
    checkDates()
    const ahora = new Date();
    const horaDeseada = new Date(
        ahora.getFullYear(),
        ahora.getMonth(),
        ahora.getDate(),
        20,
        45,
        0
      );
    
    if (horaDeseada === horaDeseada) {
      // La hora actual coincide con la hora deseada, ejecutar la función.
      ejecutarFuncion();
    }
  }
// Para el gmail
setInterval(comprobarHora, 600000); // 60000 ms = 1 minuto

