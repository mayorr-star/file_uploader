const asyncHandler = require("express-async-handler");
const { PrismaClient } = require('@prisma/client');

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

const createUser = asyncHandler(async (username, email, password) => {
  await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: password,
    },
  });
});
module.exports = { getUserByUsername, getUserById, createUser };
