const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

const getHomePage = asyncHandler(async (req, res) => {
  res.render("index");
});

const getSignUpPage = asyncHandler(async (req, res) => {
  res.render("signup");
});

const getSignInPage = asyncHandler(async (req, res) => {
  const err_msg = req.session.messages || [];
  req.session.messages = [];
  res.render("signin", {err_msg: err_msg});
});

const getDashboard = asyncHandler(async (req, res) => {
  res.render("dashboard");
});

const signOut = asyncHandler(async (req, res) => {
  req.logOut(() => res.redirect("/sign_in"));
});

module.exports = { getHomePage, getSignUpPage, getSignInPage, getDashboard, signOut };
