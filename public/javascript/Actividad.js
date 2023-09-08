function Actividad(titulo, imagenSrc, nombreModerador, fecha, userSrc) {
  this.titulo = titulo;
  this.imagenSrc = imagenSrc;
  this.userSrc = userSrc;
  this.nombreModerador = nombreModerador;
  this.fecha = fecha;
}

// Método para generar el HTML de la actividad
Actividad.prototype.toHTML = function () {
  const actividadHTML = document.createElement('div');
  actividadHTML.className = 'column';

  actividadHTML.innerHTML = `
      <img class="activityImage" src="${this.imagenSrc}" alt="${this.titulo}">
      <span class="activityTitle">${this.titulo}</span>
      <div class="user">
        <img src="${this.userSrc}" alt="Usuario">
        <div class="eventDetail">
          <span class="Asocia">${this.nombreModerador}</span>
          <span class="details">${this.fecha}</span>
        </div>
      </div>
    `;

  return actividadHTML;
};