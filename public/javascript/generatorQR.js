var qrcodeContainer = document.getElementById("campoTexto").innerHTML
console.log(qrcodeContainer)
// Función para generar y mostrar el código QR
function generateQRCode()  {

  // Elemento HTML donde se mostrará el código QR
    var qrcodeContainer = document.getElementById("campoTexto").innerHTML
    console.log(qrcodeContainer)

    // Crea una instancia de QRCode
    var qrcode = new QRCode(qrcodeContainer, {
      width: 128, // Ancho
      height: 128, // Altura 
    });


  console.log(qrcodeContainer)
  var dataToEncode = document.getElementById("campoTexto").value;

  //Genera el código QR
  qrcode.makeCode(dataToEncode);

  //Muestra el elemento qrcodeContainer
  qrcodeContainer.style.display = "block";
}

