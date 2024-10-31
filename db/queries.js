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

const getUserById = asyncHandler(async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
});

const getAllFolders = asyncHandler(async (userId) => {
  const folders = await prisma.folder.findMany({
    where: { userId: userId },
    include: { files: true, subfolders: { include: { files: true } } },
    orderBy: { createdAt: "desc" },
  });
  return folders;
});

const getRootFiles = asyncHandler(async () => {
  const rootFiles = await prisma.file.findMany({
    where: { folderId: undefined },
    orderBy: { uploadTime: "desc" },
  });
  return rootFiles;
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
  createUser,
  createFile,
  createFolder,
};
