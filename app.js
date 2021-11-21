const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = []; //En JavaScript es mejor usar let en vez de var, excepto en casos especificos.
let workItems = [];//Aca se guardan los items de la lista Work
app.set('view engine', 'ejs'); //Siempre despues de express() caso contrario la app todavia no existe

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")); //Agrega la carpeta public al servidor

app.get("/", function(req, res){
  let today = new Date();  //new Date() contiene la informacion de Fecha actual

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let day = today.toLocaleDateString("es-EC", options); //Convierte la fecha a una fecha local con las opciones de la variable anterior

  res.render("list", {listTitle: day, newListItems: items}); //Busca el archivo list dentro de la carpeta VIEWS y luego se asigna el valor de day a la variable kindOfDay para poder usar en el archivo .ejs
});


app.post("/", function(req, res){
  let item = req.body.newItem;

  if (req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work") //redirecciona a /work
  } else {
    items.push(item); //Agrega infromacion a un array, en este caso lo que contiene item se agrega a items que es un array.
    res.redirect("/");  //Redirecciona al directorio principal
  }
})

app.get("/work", function(req, res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
})

app.get("/about", function(req, res){
  res.render("about");
})




app.listen(3000, function(req, res){
  console.log("Servidor corriendo en el puerto 3000");
})
