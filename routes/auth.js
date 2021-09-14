/*
    Rutas de Usuarios /auth
    host + /api/auth

    GET = select (url param)
    POST = insert (json en el body)
    PUT = update (json en el body)
    DELETE = delete (url param)
*/

const { Router } = require("express");
const router = Router.apply();
const { check } = require("express-validator");

// Controllers (de controllers)
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

router.post(
  "/new",
  [
    //middlewares
    check("name", "Nombre requerido").not().isEmpty(),
    check("email", "email requerido").not().isEmpty(),
    check("email", "email invalido").isEmail(),
    check("password", "Password requerido").not().isEmpty(),
    check("password", "Password invalido").isLength({ min: 6 }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/",
  [
    //middlewares
    check("email", "email requerido").not().isEmpty(),
    check("email", "email invalido").isEmail(),
    check("password", "Password requerido").not().isEmpty(),
    check("password", "Password invalido").isLength({ min: 6 }),
    validarCampos,
  ],
  loginUsuario
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
