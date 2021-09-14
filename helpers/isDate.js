const moment = require("moment");

const isDate = (value) => {
  if (!value) {
    return false;
  }

  console.log(value);

  const fecha = moment(value);
  return fecha.isValid();
};
module.exports = { isDate };
