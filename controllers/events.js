const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Evento = require("../models/Evento");
const { generarJWT } = require("../helpers/jwt");

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body);
  evento.user = req.uid;

  try {
    const eventoGuardado = await evento.save();

    res.status(201).json({
      ok: true,
      eventoGuardado,
      msg: "Evento guardado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicate con la mesa de ayuda",
    });
  }
};

const getEventosUser = async (req, res = response) => {
  try {
    // Evento.find(); trae todos los registros del modelo
    // .populate('user password'); trae el detalle del objeto inmerso (como un join y trae los datos de la otra tabla)
    // const eventos = await Evento.find().populate('user', 'name');
    const eventosUsuario = await Evento.find({ user: req.uid }).populate(
      "user",
      "name"
    );

    res.status(200).json({
      ok: true,
      msg: "Obtener eventos",
      eventosUsuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicate con la mesa de ayuda",
    });
  }
};

const getEventos = async (req, res = response) => {
  try {
    // Evento.find(); trae todos los registros del modelo
    // .populate('user password'); trae el detalle del objeto inmerso (como un join y trae los datos de la otra tabla)
    // const eventos = await Evento.find().populate('user', 'name');
    const eventosUsuario = await Evento.find().populate("user", "name");

    res.status(200).json({
      ok: true,
      msg: "Obtener eventos",
      eventosUsuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicate con la mesa de ayuda",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const eventiId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventiId);

    // Si el evento no existe arroja no found
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe",
      });
    }

    // Se permitira actualizar solo si el evento es del usuario que esta logeado
    // lo sabremos por el token del usuario vs el usuario del evento
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No puede editar este evento, no autorizado",
      });
    }

    // Ya superadas las validaciones (Evento existe y es del usuario logeado)
    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    // Evento.findByIdAndUpdate(eventiId,nuevoEvento) por default retorna el objeto viejo
    // Evento.findByIdAndUpdate(eventiId,nuevoEvento,{new:true}) Si quieres el nuevo usa las opciones
    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventiId,
      nuevoEvento,
      { new: true }
    );

    res.status(200).json({
      ok: true,
      msg: "Evento actualizado",
      eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicate con la mesa de ayuda",
    });
  }
};

const borrarEvento = async (req, res = response) => {
  const eventiId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventiId);

    // Si el evento no existe arroja no found
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe",
      });
    }

    // Se permitira borrar solo si el evento es del usuario que esta logeado
    // lo sabremos por el token del usuario vs el usuario del evento
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No puede eliminar este evento, no autorizado",
      });
    }

    // Ya superadas las validaciones (Evento existe y es del usuario logeado)
    await Evento.findByIdAndDelete(eventiId);
    res.status(200).json({
      ok: true,
      msg: "Evento borrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicate con la mesa de ayuda",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  borrarEvento,
  getEventosUser,
};
