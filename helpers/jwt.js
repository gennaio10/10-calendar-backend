const jwt = require("jsonwebtoken");

const generarJWT = (uid, name) => {
  return new Promise((resolver, reject) => {
    const payload = { uid, name };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEDD,
      { expiresIn: '1h' },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("Token no generado");
        }
        resolver(token);
      }
    );
  });
};

module.exports = { generarJWT };
