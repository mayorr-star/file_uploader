const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { NotFoundError } = require("../error handling/errors/errors");

const renderUploadPage = asyncHandler(async (req, res) => {
  const folderId = req.params.folderId || null;
  const url = folderId ? `/file/upload/${folderId}/new` : "/file/upload/new";
  res.render("uploadfile", { user: Boolean(req.user), url: url });
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
  if (!file) throw new NotFoundError("Not found, file does not exist");
  res.render("file", { user: Boolean(req.user), file: file });
});

module.exports = { renderUploadPage, postFile, getFile };
