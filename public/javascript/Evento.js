// Definir un constructor para el objeto de evento
function Evento(id, titulo, imagenSrc, nombreAsociacion, fecha, capacidad, categorias, descripcion, requerimientos, fechaHorario, cupos, userSrc, rating) {
  this.id = id;
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
  this.rating = rating;
}

// Método para generar el HTML del evento
Evento.prototype.toHTML = function () {
  const eventHTML = document.createElement('div');
  eventHTML.className = 'column';

  eventHTML.innerHTML = `
  <div class="evento" onclick="redirectToEvent('${this.id}')">
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
        <button class="buttonT1" id="inscribirButton">Inscribirme</button>
        <button class="buttonT1" id="verListButton">Ver asistentes</button>
        <p class="info" id="cuposEventPage">Cupos: ${this.cupos}/${this.capacidad}</p>
      </div>
    `;

  return eventExtendedHTML;
};


export default Evento;