async function sendMailBody(pFrom, pCode, pTo) {
  console.log("Adentro")
  var params = {
  from_name : pFrom,
  message :pCode,
  to_name : pTo,
}

emailjs.send("service_mj29igk", "template_52068l2",params).then(function (res){
  console.log("Success!"+ res.status);
});
}

export default sendMailBody;