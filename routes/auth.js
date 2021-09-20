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
// $ref: '#/components/schemas/UsuarioOk'
/**
 * @swagger
 *  components:
 *  schemas:
 *      UsuarioBad:
 *          type: object
 *          required:
 *              - ok
 *              - msg
 *          properties:
 *              ok:
 *                  type: String
 *                  description: name user
 *              msg:
 *                  type: String
 *                  description: name user
 *          example:
 *              ok: false
 *              msg: Error description
 *      UsuarioOk:
 *          type: object
 *          required:
 *              - ok
 *              - uid
 *              - name
 *              - token
 *          properties:
 *              ok:
 *                  type: String
 *                  description: name user
 *              uid:
 *                  type: String
 *                  description: name user
 *              name:
 *                  type: String
 *                  description: email user
 *              token:
 *                  type: String
 *                  description: password user
 *          example:
 *              ok: true
 *              uid: 613bfb9a4f2ff5f88888888a
 *              name: Nombres y apellidos
 *              token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTNiZmI5YTRmMmZmNWYyNTY3MDQxNWEiLCJuYW1lIjoiUG9yb3JvIiwiaWF0IjoxNjMxODk5MDkxLCJleHAiOjE2MzE999999999.6DcXhxJjhjMVyHVtcyd_5D5Lr3PRILDUsqLi9TBb2Jc
 */

// Controllers (de controllers)
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const idLength = 8;

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: controller Usuarios
 */

/**
 * @swagger
 * /api/auth:
 *  post:
 *      description: Login User
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: Usuario logeado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioOk'
 *          400:
 *              description: Usuario y/o password no son corectos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioBad'
 *          404:
 *              description: Not Found 
 *          412:
 *              description: Precondition Failed
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioBad'
 */
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

/**
 * @swagger
 * /api/auth/renew:
 *  get:
 *      description: Token renewed
 *      tags: [Auth]
 *      parameters:
 *      - name: x-token
 *        in: header
 *        required: true
 *        type: string
 *      responses:
 *          200:
 *              description: Token renovado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioOk'
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioBad'
 *          404:
 *              description: Not Found 
 *          412:
 *              description: Precondition Failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioBad'
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioBad'
 */
router.get("/renew", validarJWT, revalidarToken);

/**
 * @swagger
 * /api/auth/new:
 *  post:
 *      description: Add User
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          201:
 *              description: Usuario Creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioOk'
 *          400:
 *              description: Usuario ya existe
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioBad'
 *          404:
 *              description: Not Found 
 *          412:
 *              description: Precondition Failed
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UsuarioBad'
 */
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

module.exports = router;
