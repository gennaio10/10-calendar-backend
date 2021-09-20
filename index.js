const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");

console.log("Levantando express");

require("dotenv").config();
console.log(process.env);

// Crear el servidor de express
// es standar que se lenga app
const app = express();
console.log("Servidor express creado");

// SWAGGER UI AND JSDOC
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
// https://swagger.io/specification/   #Info Object
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Calendar-App Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a CRUD API application made with Express and documented with Swagger",
      contact: {
        name: "Julian Herrera",
      },
      servers: [`http://localhost:${process.env.PORT}`],
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);

// a app.use("/api-docs", swaggerUi.serve);
// a app.get("/api-docs", swaggerUi.setup(swaggerDocs, { explorer: true }));

// conectar base de datos
dbConnection();

// CORS
app.use(cors());

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
