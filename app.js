const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

let items = []; //En JavaScript es mejor usar let en vez de var, excepto en casos especificos.
let workItems = [];//Aca se guardan los items de la lista Work
app.set('view engine', 'ejs'); //Siempre despues de express() caso contrario la app todavia no existe

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")); //Agrega la carpeta public al servidor

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true}); //Coencta y crea la base de datos

const itemsSchema = { //Esquema de la tabla
  name: String
};

const Item = mongoose.model("Item", itemsSchema); //Crea la tabla


//datos que van a estar por defecto
const item1 = new Item({
  name: "Welcome to your ToDoList"
});

const item2 = new Item({
  name: "Hit the + button to add a new Item"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);





app.get("/", function(req, res){

  Item.find({}, function(err, foundItems){ //Metodo para devolver los items de la base de datos

  if (foundItems.length === 0){ //Solo si la base de datos esta vacia
    Item.insertMany(defaultItems, function(err){ //La funcion para que se inserten los datos antes dados en la BD.
      if (err){
        console.log(err);
      } else {
        console.log("Se ha agregado correctamente los items a la DB");
      }
    });
    res.redirect("/"); //Regresa a la ruta / para volver a ejecutar este codigo y pasar al else porque ya se agregaron datos.
  } else {
    res.render("list", {listTitle: "Today", newListItems: foundItems}); //Busca el archivo list dentro de la carpeta VIEWS y luego se asigna el nombre de la lista para poder usar en el archivo .ejs
  }

  })
});

//Diferebntes listas

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);  //req.paramas.customListName es lo que sea que el usuario ingrese despues del slash

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if(!foundList){
        //Crear una nueva lista
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        //Muestra una lista existente

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  })


})


app.post("/", function(req, res){
  const itemName = req.body.newItem; //Almacena la nota agregada en .ejs

  const listName = req.body.list; //Almacena el nombre de cada lista creada en ejs

  const item = new Item({ //Metodo que Agrega el nuevo item a la espera para ingresar a la base de datos.
    name: itemName
  });

  if (listName === "Today"){
    item.save();//Ingresa los datos en la BD.

    res.redirect("/"); //Para pasar nuevamente al if y despues al res.render.
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }

});


//Metodo para borrar las items

app.post("/delete", function(req, res){ //metodo para borrar items
  const checkedItemId = req.body.ckeckbox; //Almacena la informacion de si se ha activado el checkbox y el id de esa nota

  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err){
        console.log("Succesfully deleted checked items");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }

});



app.get("/about", function(req, res){
  res.render("about");
})




app.listen(3000, function(req, res){
  console.log("Servidor corriendo en el puerto 3000");
})
