const express = require("express");
const bodyParser = require("body-parser");

//importamos las rutas ubicadas en el archivo routers
const router = require("./routes/routers");

//crea una instancia de una aplicación de servidor web utilizando el framework Express.js
const app = express();

//utilizamos el middleware bodyParser.urlencoded() para el manejo de datos
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(router);

//asignamos un puerto a nuestra app
app.listen(3500,()=>{
    console.log("Iniciando el servidor en el puerto 3500")
});