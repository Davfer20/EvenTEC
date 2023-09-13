import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { app } from "./firebaseconfig.js"
import Rating from './Rating.js';

const database = getDatabase(app)

let ratingValue;
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('eventId');

function openRateEmail(){
  const rateContainer = document.querySelector('.rateContainer');
  rateContainer.style.opacity = 1;
  rateContainer.style.zIndex = 1;
}

function closeRateEmail(){
  const rateContainer = document.querySelector('.rateContainer');
  rateContainer.style.opacity = 0;
  rateContainer.style.zIndex = -1;
}

function rateUpload(){
  console.log('Comienza upload');
  let userInfo = JSON.parse(localStorage.getItem('userInfo'));

  console.log(eventId);
  console.log(userInfo.username);
  console.log(ratingValue);
  console.log(text.value);

  const rateEvent = new Rating(
    eventId,
    userInfo.username,
    ratingValue,
    text.value
  )

  const rateRed = ref(database, 'rating');
  const newForoRef = push(rateRed); // Genera una referencia con ID automático
  set(newForoRef, rateEvent);

  closeRateEmail()
}

const sendButton = document.getElementById('sendButton'); 
sendButton.addEventListener('click', openRateEmail);

const sendButton2 = document.getElementById('sendButton2');
sendButton2.addEventListener('click', rateUpload);

const text = document.getElementById('commentRate');

const ratingInputs = document.querySelectorAll('input[name="rating"]');


ratingInputs.forEach(input => {
  input.addEventListener('change', function() {
    const selectedRating = document.querySelector('input[name="rating"]:checked');

    if (selectedRating) {
      ratingValue = selectedRating.value;
      console.log('Rating seleccionado:', ratingValue);
      // Puedes realizar las acciones que desees con el valor del rating aquí.
    } else {
    }
  });


});
