const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

const renderUploadPage = asyncHandler(async (req, res) => {
  res.render("uploadfile", { user: Boolean(req.user) });
});

const postFile = asyncHandler(async (req, res) => {
  const { originalname, size } = req.file;
  const folderId = req.params.folderId;
  await db.createFile(originalname, size, req.user.id, folderId);
  res.redirect("/dashboard");
});

const getFile = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId;
  const file = await db.getUniqueFile(fileId, req.user.id);
  res.render("file", {user: Boolean(req.user), file: file });
});

module.exports = { renderUploadPage, postFile, getFile };
