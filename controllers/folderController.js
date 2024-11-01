const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const { NotFoundError } = require("../error handling/errors/errors");

const renderFolderForm = asyncHandler(async (req, res) => {
  res.render("folder", { user: Boolean(req.user) });
});

const postFolder = asyncHandler(async (req, res) => {
  const folderName = req.body.name || "New folder";
  await db.createFolder(folderName, req.user.id);
  res.redirect("/dashboard");
});

const getFolderContent = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const folder = await db.getUniqueFolder(folderId);
  if (!folder) throw new NotFoundError('Not found, Folder does nt exist')
  const folderName = folder.name;
  const files = folder.files;
  res.render("folderContent", {
    user: Boolean(req.user),
    folderName: folderName,
    files: files,
  });
});

const renderUpdateForm = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const folder = await db.getUniqueFolder(folderId);
  res.render("update", { user: Boolean(req.user), folder: folder });
});

const updateFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const {folderId} = req.params;
  await db.updateFolder(folderId, name);
   res.redirect('/dashboard')
});

const deleteFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const {folderId} = req.params;
  await db.deleteFolder(folderId, name);
   res.redirect('/dashboard')
});

module.exports = {
  renderFolderForm,
  renderUpdateForm,
  postFolder,
  updateFolder,
  getFolderContent,
  deleteFolder
};
