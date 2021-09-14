const express = require("express");
const cors = require('cors')
const { dbConnection } = require("./database/config");

console.log("Levantando express");

require("dotenv").config();
console.log(process.env); 

// Crear el servidor de express
// es standar que se lenga app
const app = express();
console.log("Servidor express creado");

// conectar base de datos
dbConnection();

// CORS
app.use(cors())

//Directorio publico
//app.use es un middleware
//Las funciones de middleware son funciones que tienen acceso
//al objeto de solicitud (req), al objeto de respuesta (res)
app.use(express.static("public"));

//Lectura y parseo del doby
app.use(express.json());

//Rutas (las de routes)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor express corriendo en el puerto ${process.env.PORT}`);
});
