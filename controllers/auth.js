const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Valida si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      res.status(400).json({
        ok: false,
        msg: "Usuario ya existe",
      });
    }
    // Si el usuario no existe
    // Crea el nuevo usuario basado en el contenido del body
    usuario = new Usuario(req.body);
    // Encriptar password
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);
    // Registra en la db de mongo
    await usuario.save();

    // Generar Json Wen Token ( JWT )
    const token = await generarJWT(usuario.id, usuario.name);

    // Confirma con respuesta 201
    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicate con la mesa de ayuda",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Valida si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      // Si el usuario no existe lo saca de una vez con un 400
      return res.status(400).json({
        ok: false,
        msg: "Usuario y/o password no son corectos",
      });
    }

    // Conformar si el password encriptado es correcto
    const validPassword = bcrypt.compareSync(password, usuario.password);
    // si el password no es el correcto
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario y/o password no son corectos",
      });
    }

    // Generar Json Wen Token ( JWT )
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(200).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicate con la mesa de ayuda",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;

  try {
    // Generar Json Wen Token ( JWT )
    const token = await generarJWT(uid, name);

    res.status(200).json({
      ok: true,
      uid: uid,
      name: name,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicate con la mesa de ayuda",
    });
  }
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };
