let currentOption = 0 // Se encarga en validar si es estudiante, asocia o colaborador
let loginRefs = ["html/loginE.html", "html/loginA.html", "html/loginC.html"]
let singinRefs = ["html/signinE.html", "html/signinA.html", "html/signinC.html"]

// Toma la opcion segun lo que se escoga en el HTML del inicio
function selectMethod(n) {
  currentOption = n
}
// Botón del login
function loginButton() {
  location.href = loginRefs[currentOption]
}
// Botón del sign in
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

