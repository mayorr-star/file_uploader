const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { NotFoundError } = require("../error handling/errors/errors");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const generateUniquePublicId = require("../utilis/generateUniquePublicId");
const axios = require("axios");

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
  const url = await cloudinary.uploader.upload(req.file.path, {
    public_id: generateUniquePublicId(originalname),
    resource_type: "auto",
    overwrite: true,
  });
  req.cloudinaryUrl = url;
  next();
});

const postFile = asyncHandler(async (req, res) => {
  const { originalname, size } = req.file;
  const folderId = req.params.folderId;
  const publicId = req.cloudinaryUrl.public_id;
  await db.createFile(
    originalname,
    size,
    req.user.id,
    req.cloudinaryUrl.secure_url,
    publicId,
    folderId
  );
  const route = folderId ? `/folder/${folderId}/open` : "/dashboard";
  res.redirect(route);
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
  const response = await axios.get(file.url, { responseType: "stream" });
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
  res.setHeader("Content-Type", response.headers["content-type"]);
  response.data.pipe(res);
  const route = folderId ? `/folder/${folderId}/open` : "/dashboard";
  res.redirect(route);
});

const deleteFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const file = await db.getUniqueFile(fileId);
  const folderId = file.folderId;
  await db.deleteFileFromBD(fileId);
  const route = folderId ? `/folder/${folderId}/open` : "/dashboard";
  res.redirect(route);
});

const deleteFileFromCloudinary = asyncHandler(async (req, res, next) => {
  const { fileId } = req.params;
  const file = await db.getUniqueFile(fileId);
  const publicId = file.publicId;
  await cloudinary.uploader.destroy(publicId);
  next();
});

module.exports = {
  renderUploadPage,
  postFile,
  postFileToMulter,
  postFileToCloudinary,
  getFile,
  downloadFile,
  deleteFile,
  deleteFileFromCloudinary,
};
