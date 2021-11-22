
//Este archivo es para tener separados los procesos que son distintos. Aca se procesa la fecha solamente


exports.getDate = getDate; //Exporta la funcion getDate para poder ser usada en otro archivo

function getDate(){
  let today = new Date();  //new Date() contiene la informacion de Fecha actual

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let day = today.toLocaleDateString("es-EC", options); //Convierte la fecha a una fecha local con las opciones de la variable anterior
  return day;
}
