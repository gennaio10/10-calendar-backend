const { response } = require("express");
const { validationResult } = require("express-validator");

const validarCampos = (req, res = response, next) => {
  //valida errores definidores en el check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(412).json({
      ok: false,
      msg: errors.mapped(),
    });
  }

  //si no se tienen errores continua con la siguiente validacion
  next();
};

module.exports = { validarCampos };
