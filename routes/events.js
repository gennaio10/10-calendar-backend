/*
    Rutas de Usuarios /events
    host + /api/events

    GET = select (url param)
    POST = insert (json en el body)
    PUT = update (json en el body) tambien se puede (url param)
    DELETE = delete (url param)
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

// Controllers (de controllers)
const {
  getEventos,
  crearEvento,
  actualizarEvento,
  borrarEvento,
  getEventosUser,
} = require("../controllers/events");

const router = Router.apply();
// Validar token en todas las peticiones de forma obligatoria
// Se validaran todas las t=peticiones que esten debajo de esta linea
// en caso que no quiera validar alguna poner esta linea despues (mas adelantes, mas abajo, etc...)
router.use(validarJWT);

// POST = insert (json en el body)
router.post(
  "/",
  [
    //middlewares
    check("title", "Title requerido").not().isEmpty(),
    check("start", "fecha inicio invalida").custom(isDate),
    check("end", "fecha finalizacion invalida").custom(isDate),
    validarCampos,
  ],
  crearEvento
);

// GET = select (url param)
router.get("/", getEventos);

// GET = select (url param)
router.get("/user", getEventosUser);

// PUT = update (json en el body)
router.put(
  "/:id",
  [
    //middlewares
    check("id", "Id requerido").not().isEmpty(),
    check("title", "Title requerido").not().isEmpty(),
    check("start", "start requerido").not().isEmpty(),
    check("end", "end requerido").not().isEmpty(),
    validarCampos,
  ],
  actualizarEvento
);

// DELETE = delete (url param)
router.delete("/:id", borrarEvento);

module.exports = router;
