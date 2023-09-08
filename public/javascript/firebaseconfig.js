// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCdsK-CFzKqpKYmbiFC1TvETPI0L4aIqQ4",
    authDomain: "eventec-f9ff1.firebaseapp.com",
    projectId: "eventec-f9ff1",
    storageBucket: "eventec-f9ff1.appspot.com",
    messagingSenderId: "631910424274",
    appId: "1:631910424274:web:97445c27b696b60076d70b",
    measurementId: "G-PSB298X4G3",
    databaseURL: "https://eventec-f9ff1-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

