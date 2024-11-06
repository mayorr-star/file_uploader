const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUserByUsername = asyncHandler(async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
});

const getUserById = asyncHandler(async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
});

const getRootFolders = asyncHandler(async (userId) => {
  const folders = await prisma.folder.findMany({
    where: { userId: userId, parentId: null },
    orderBy: { createdAt: "desc" },
  });
  return folders;
});

const getRootFiles = asyncHandler(async () => {
  const rootFiles = await prisma.file.findMany({
    where: { folderId: null },
    orderBy: { uploadTime: "desc" },
  });
  return rootFiles;
});

const getUniqueFile = asyncHandler(async (id) => {
  const file = await prisma.file.findUnique({
    where: { id: id },
  });
  return file;
});

const getUniqueFolder = asyncHandler(async (id) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: id,
    },
    include: { files: true, subfolders: { include: { files: true } } },
  });
  return folder;
});

const createUser = asyncHandler(async (username, email, password) => {
  await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: password,
    },
  });
});

const createFile = asyncHandler(
  async (fileName, size, userId, url, publicId, folderId = null) => {
    await prisma.file.create({
      data: {
        name: fileName,
        size: size,
        user: { connect: { id: userId } },
        folder: folderId ? { connect: { id: folderId } } : undefined,
        url: url,
        publicId: publicId
      },
    });
  }
);

const createFolder = asyncHandler(
  async (folderName, userId, parentId = null) => {
    await prisma.folder.create({
      data: {
        name: folderName,
        user: { connect: { id: userId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
    });
  }
);

const updateFolder = asyncHandler(async (id, newName) => {
  await prisma.folder.update({
    where: {
      id: id,
    },
    data: {
      name: newName,
    },
  });
});

const deleteFiles = asyncHandler(async (folderId) => {
  await prisma.file.deleteMany({
    where: { folderId: folderId },
  });
});

const deleteFileFromBD = asyncHandler(async (fileId) => {
  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
});

const deleteFolder = asyncHandler(async (id) => {
  await prisma.folder.delete({
    where: {
      id: id,
    },
  });
});

module.exports = {
  getUserByUsername,
  getUserById,
  getRootFolders,
  getRootFiles,
  getUniqueFile,
  getUniqueFolder,
  createUser,
  createFile,
  createFolder,
  updateFolder,
  deleteFolder,
  deleteFiles,
  deleteFileFromBD
};
