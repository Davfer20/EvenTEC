// Definir un constructor para el objeto de evento
function Evento(titulo, imagenSrc, nombreAsociacion, fecha, capacidad, categorias, descripcion, requerimientos, fechaHorario, cupos, userSrc) {
  this.titulo = titulo;
  this.imagenSrc = imagenSrc;
  this.nombreAsociacion = nombreAsociacion;
  this.fecha = fecha;
  this.capacidad = capacidad;
  this.categorias = categorias;
  this.descripcion = descripcion;
  this.requerimientos = requerimientos;
  this.fechaHorario = fechaHorario;
  this.cupos = cupos;
  this.userSrc = userSrc;
}

// Método para generar el HTML del evento
Evento.prototype.toHTML = function () {
  const eventHTML = document.createElement('div');
  eventHTML.className = 'column';

  eventHTML.innerHTML = `
      <div class="evento" onclick="location.href = 'verEvento.html';">
        <img src="${this.imagenSrc}" alt="${this.titulo}">
        <span class="eventTitle">${this.titulo}</span>
        <div class="user">
          <img src="${this.userSrc}" alt="Usuario">
          <div class="eventDetail">
            <span class="Asocia">${this.nombreAsociacion}</span>
            <span class="details">${this.fecha} · ${this.capacidad}</span>
          </div>
        </div>
      </div>
      <aside class="sidebar">
        ${this.categorias.map(x => `<div class="sidebar-item"><span>${x}</span></div>`).join('')}
      </aside>
    `;

  return eventHTML;
};

// Método para generar el HTML extendido del evento
Evento.prototype.toExtendedHTML = function () {
  const eventExtendedHTML = document.createElement('div');
  eventExtendedHTML.className = 'item';

  eventExtendedHTML.innerHTML = `
      <img class="eventImage" src="${this.imagenSrc}" alt="${this.titulo}">
      <div class="content">
        <span class="title">${this.titulo}</span>
        <div class="categories">
          ${this.categorias.map(categoria => `<div class="sidebar-item"><span>${categoria}</span></div>`).join('')}
        </div>
        <p class="info">${this.descripcion}</p>
        <p class="info">${this.requerimientos}</p>
        <span>${this.fechaHorario}</span>
        <button class="buttonT1">Reservar</button>
        <p class="info">Cupos: ${this.cupos}</p>
      </div>
    `;

  return eventExtendedHTML;
};
