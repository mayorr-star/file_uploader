const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { NotFoundError } = require("../error handling/errors/errors");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const generateUniquePublicId = require("../utilis/generateUniquePublicId");

const renderUploadPage = asyncHandler(async (req, res) => {
  const folderId = req.params.folderId || null;
  const url = folderId ? `/file/upload/${folderId}/new` : "/file/upload/new";
  res.render("uploadfile", { user: Boolean(req.user), url: url });
});

const postFileToMulter = asyncHandler(async (req, res, next) => {
  upload.single("file")(req, res, next);
});

const postFileToCloudinary = asyncHandler(async (req, res, next) => {
  if (!req.file) return res.status(400);
  const { originalname, mimetype } = req.file;
  await cloudinary.uploader.upload(req.file.path, {
    public_id: generateUniquePublicId(originalname),
    resource_type: 'auto',
    overwrite: true,
  });
  next();
});

const postFile = asyncHandler(async (req, res) => {
  const { originalname, size } = req.file;
  const folderId = req.params.folderId;
  await db.createFile(originalname, size, req.user.id, folderId);
  const route = folderId ? '/dashboard' : `/folder${folderId}/open`
  res.redirect(route);;
});

const getFile = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId;
  const file = await db.getUniqueFile(fileId);
  if (!file) throw new NotFoundError("Not found, file does not exist");
  res.render("file", { user: Boolean(req.user), file: file });
});

const downloadFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const file = await db.getUniqueFile(fileId);
});

module.exports = {
  renderUploadPage,
  postFile,
  postFileToMulter,
  postFileToCloudinary,
  getFile,
  downloadFile,
};
