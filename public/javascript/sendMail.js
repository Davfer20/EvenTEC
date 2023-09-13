function sendMail(pFrom, pCode, pTo) {
    console.log("Adentro")
    var params = {
    from_name : pFrom,
    QR_code :pCode,
    to_id : pTo,
  }

  emailjs.send("service_mj29igk", "template_37savtf",params).then(function (res){
    alert("Success!"+ res.status);
  });
} 
export default sendMail;

