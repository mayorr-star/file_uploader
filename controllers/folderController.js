const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const db = require("../db/queries");
const { NotFoundError } = require("../error handling/errors/errors");

const renderFolderForm = asyncHandler(async (req, res) => {
  const parentId = req.params.parentId || null;
  const url = parentId ? `/folder/create/${parentId}/new` : "/folder/create/new";
  res.render("folder", { user: Boolean(req.user), url: url });
});

const postFolder = asyncHandler(async (req, res) => {
  const folderName = req.body.name || "New folder";
  const {parentId} = req.params;
  await db.createFolder(folderName, req.user.id, parentId);
  res.redirect("/dashboard");
});

const getFolderContent = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const folder = await db.getUniqueFolder(folderId);
  if (!folder) throw new NotFoundError("Not found, Folder does not exist");
  const subfolders = folder.subfolders;
  const files = folder.files;
  res.render("folderContent", {
    user: Boolean(req.user),
    folder: folder,
    files: files,
    subfolders: subfolders
  });
});

const renderUpdateForm = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const folder = await db.getUniqueFolder(folderId);
  res.render("update", { user: Boolean(req.user), folder: folder });
});

const updateFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { folderId } = req.params;
  await db.updateFolder(folderId, name);
  res.redirect("/dashboard");
});

const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const folder = await db.getUniqueFolder(folderId);
  const parentId = folder.parentId;
  const deletedFileIds = await Promise.all(
    folder.files.map(async (file) => {
      try {
        await cloudinary.uploader.destroy(file.publicId);
      } catch (error) {
        console.error(`Error deleting file ${publicId}:`, error);
        return null;
      }
    })
  );
  await db.deleteFiles(folderId);
  await db.deleteFolder(folderId);
  const route = parentId ? `/folder/${folderId}/open` : '/dashboard';
  res.redirect(route);
});

module.exports = {
  renderFolderForm,
  renderUpdateForm,
  postFolder,
  updateFolder,
  getFolderContent,
  deleteFolder,
};
