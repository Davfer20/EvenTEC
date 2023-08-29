let currentOption = 0
let loginRefs = ["../html/loginE.html", "../html/loginA.html", "../html/loginC.html"]
let singinRefs = ["../html/signinE.html", "../html/signinA.html", "../html/signinC.html"]


function selectMethod(n) {
  currentOption = n
}

function loginButton() {
  location.href = loginRefs[currentOption]
}

function singinButton() {
  location.href = singinRefs[currentOption]
}


const botones = document.querySelectorAll('.image-button');

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    // Eliminar la clase 'presionado' de todos los botones
    botones.forEach(boton => {
      boton.classList.remove('pressed');
    });

    // Agregar la clase 'presionado' al botón actual
    boton.classList.add('pressed');
  });
});

