const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { NotFoundError } = require("../error handling/errors/errors");

const prisma = new PrismaClient();

const getUserByUsername = asyncHandler(async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    throw new NotFoundError("Not found, cannot get user");
  }
  return user;
});

const getUserById = asyncHandler(async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new NotFoundError("Not found, user does not exist");
  }
  return user;
});

const getAllFolders = asyncHandler(async (userId) => {
  const folders = await prisma.folder.findMany({
    where: { userId: userId },
    include: { files: true, subfolders: { include: { files: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (!folders) {
    throw new NotFoundError("Not found, cannot get folders");
  }
  return folders;
});

const getRootFiles = asyncHandler(async () => {
  const rootFiles = await prisma.file.findMany({
    where: { folderId: undefined },
    orderBy: { uploadTime: "desc" },
  });
  if (!rootFiles) {
    throw new NotFoundError("Not found, cannot get files");
  }
  return rootFiles;
});

const getUniqueFile = asyncHandler(async (fileId, userId) => {
  const file = await prisma.file.findUnique({
    where: { userId: userId, id: fileId },
  });
  if (!user) {
    throw new NotFoundError("Not found, file does not exist");
  }
  return file;
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
  async (fileName, size, userId, folderId = null) => {
    await prisma.file.create({
      data: {
        name: fileName,
        size: size,
        user: { connect: { id: userId } },
        folder: folderId ? { connect: { id: folderId } } : undefined,
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
module.exports = {
  getUserByUsername,
  getUserById,
  getAllFolders,
  getRootFiles,
  getUniqueFile,
  createUser,
  createFile,
  createFolder,
};
