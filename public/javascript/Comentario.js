// Definir un constructor para el objeto de comentario
function Comentario(texto, nombreUsuario, fecha, imageUrl) {
    this.texto = texto;
    this.nombreUsuario = nombreUsuario;
    this.fecha = fecha;
    this.imageUrl = imageUrl;
}

// Método para generar el HTML del comentario
Comentario.prototype.toHTML = function () {
    const comentarioHTML = document.createElement('div');
    comentarioHTML.className = 'comentario';

    comentarioHTML.innerHTML = `
      <img src="${this.imageUrl}" alt="Foto de Perfil" class="foto-perfil">
      <div class="contenido-comentario">
          <p class="comentario-texto">
              ${this.texto}
          </p>
          <div class="informacion-adicional">
              <p class="nombre">${this.nombreUsuario}</p>
              <p class="fecha">${this.fecha}</p>
          </div>
          <div class="acciones">
              <button class="btn-responder">Responder</button>
              <button class="btn-like">Like</button>
          </div>
      </div>
    `;

    return comentarioHTML;
};
export default Comentario;