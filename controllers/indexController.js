const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

const getHomePage = asyncHandler(async (req, res) => {
  res.render("index");
});

const getSignUpPage = asyncHandler(async (req, res) => {
  res.render("signup");
});

const getSignInPage= asyncHandler(async(req, res) => {
  res.render('signin');
})



module.exports = { getHomePage, getSignUpPage, getSignInPage };
