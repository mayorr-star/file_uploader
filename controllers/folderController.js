const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

const renderFolderForm = asyncHandler(async (req, res) => {
  res.render("folder", { user: Boolean(req.user) });
});

module.exports = { renderFolderForm };
