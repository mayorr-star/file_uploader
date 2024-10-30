const bycrypt = require("bcryptjs");

const generatePassword = async (password) => {
  const saltHash = await bycrypt.hash(password, 10);
  return saltHash;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  const result = await bycrypt.compare(plainPassword, hashedPassword);
  return result;
};

module.exports = { generatePassword, verifyPassword };
