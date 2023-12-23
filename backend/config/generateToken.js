const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const expiresIn = "30d";
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn });
};
module.exports = generateToken;
