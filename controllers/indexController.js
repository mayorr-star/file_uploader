const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

const getHomePage = asyncHandler(async (req, res) => {
  res.render("index");
});

const getSignUpPage = asyncHandler(async (req, res) => {
  res.render("signup");
});



module.exports = { getHomePage, getSignUpPage };
