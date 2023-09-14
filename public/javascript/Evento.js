// Definir un constructor para el objeto de evento
function Evento(id, titulo, imagenSrc, nombreAsociacion, userAsociacion, fecha, capacidad, categorias, descripcion, requerimientos, fechaHorario, cupos, userSrc, rating, clicks) {
  this.id = id;
  this.titulo = titulo;
  this.imagenSrc = imagenSrc;
  this.nombreAsociacion = nombreAsociacion;
  this.userAsociacion = userAsociacion;
  this.fecha = fecha;
  this.capacidad = capacidad;
  this.categorias = categorias;
  this.descripcion = descripcion;
  this.requerimientos = requerimientos;
  this.fechaHorario = fechaHorario;
  this.cupos = cupos;
  this.userSrc = userSrc;
  this.rating = rating;
  this.clicks = clicks;
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
            <span class="details"><span class="fechaEvento" id="${this.id}">${this.fecha}</span> · ${this.cupos}/${this.capacidad}</span>
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

// Método para generar el HTML del informe de análisis
Evento.prototype.toInformeHTML = function () {
  const eventExtendedHTML = document.createElement('div');
  eventExtendedHTML.className = 'content';
  eventExtendedHTML.id = "informeContent";


  eventExtendedHTML.innerHTML = `
  <span class="title">${this.titulo}</span>
  <p class="informeText">${this.descripcion}</p>
  <p class="informeText">${this.requerimientos}</p>
  <p class="informeText">${this.fechaHorario}</p>
  <p class="informeText" id="cantidadClicks">Cantidad de clicks en el evento: ${this.clicks}</p>
  <p class="informeText" id="cuposEventPage">Cupos: ${this.cupos}/${this.capacidad}</p>
  <p class="informeText" id="porcentajeAsistencia"></p>
  <p class="informeText" id="listaDeUsuarios">Lista de usuarios inscritos: </p>
  <div class="tableContainer">
      <table class="listaInscritos" id="listaInscritos">
        <thead>
          <tr>
              <th>Nombre</th>
              <th>Carnet</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Carrera</th>
              <th>Sede</th>
              <th>Fecha de registro</th>
          </tr>
        </thead>
      </table>
  </div>
  <p class="informeText" id="carrerasText">Cantidad de estudiantes por carrera: </p>
  <div class="tableContainer">
      <table class="listaInscritos" id="estudiantesCarreras">
          <tr>
              <th>Carrera</th>
              <th>Cantidad de estudiantes</th>
          </tr>
      </table>
  </div>
  <p class="informeText" id="cancelaciones">Cantidad de cancelaciones: </p>
  <p class="informeText" id="ratingInforme">Rating: ${this.rating} </p>
  <p class="informeText" id="cantidadComentarios">Cantidad de comentarios: </p>
  <p><span class="title">Análisis de resultados</span></p>
  <p>Ratings de actividades</p>
  <p id="comentariosSubtitle">Comentarios</p>
  <div id="comentariosDiv"></div>
  <button class="buttonT1" id="cerrarInformeButton">Cerrar</button>
    `;

  return eventExtendedHTML;
};

export default Evento;