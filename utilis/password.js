const bycrypt = require("bcryptjs");

const generatePassword = (password) => {
  const saltHash = bycrypt.hash(password, 10);
  return saltHash;
};

const verifyPassword = (password, userSalt) => {
  return bycrypt.compare(password, userSalt);
};

module.exports = { generatePassword, verifyPassword };
