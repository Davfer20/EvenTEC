// Definir un constructor para el objeto de notificación
function Notificacion(subject, message, date, imageUrl) {
    this.subject = subject;
    this.message = message;
    this.date = date;
    this.imageUrl = imageUrl;
}

// Método para generar el HTML de la notificación
Notificacion.prototype.toHTML = function () { 
    const notificacionHTML = document.createElement('div');
    notificacionHTML.className = 'profile-item';
    notificacionHTML.innerHTML = `
      <img class="profile-picture" src="${this.imageUrl}" alt="Foto de perfil" />
      <div class="profile-details">
        <div class="profile-name">
          <span class="subject">${this.subject}:</span> ${this.message}
        </div>
        <div class="profile-date">${this.date}</div>
      </div>
    `;

    return notificacionHTML;
};

export default Notificacion;
