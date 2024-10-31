const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { NotFoundError } = require("../error handling/errors/errors");

const getHomePage = asyncHandler(async (req, res) => {
  res.render("index", { user: Boolean(req.user) });
});

const getSignUpPage = asyncHandler(async (req, res) => {
  res.render("signup", { user: Boolean(req.user) });
});

const getSignInPage = asyncHandler(async (req, res) => {
  const err_msg = req.session.messages || [];
  req.session.messages = [];
  res.render("signin", { user: Boolean(req.user), err_msg: err_msg });
});

const getDashboard = asyncHandler(async (req, res) => {
  const folders = await db.getAllFolders(req.user.id);
  const rootFiles = await db.getRootFiles();
  if (!folders) {
    throw new NotFoundError('Not found, cannot get folders');
  } else if (!rootFiles) {
    throw new NotFoundError('Not found, cannot get files');
  }
  res.render("dashboard", {
    username: req.user.username,
    user: Boolean(req.user),
    folders: folders,
    rootFiles: rootFiles,
  });
});

const signOut = asyncHandler(async (req, res) => {
  req.logOut(() => res.redirect("/sign_in"));
});

module.exports = {
  getHomePage,
  getSignUpPage,
  getSignInPage,
  getDashboard,
  signOut,
};
