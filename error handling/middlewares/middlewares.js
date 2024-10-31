const handleNotFoundError = (err, req, res, next) => {
  if (err.name === "NotFoundError") {
    console.error("Error:", err);
    res.status(err.status).render("404");
  } else {
    next(err);
  }
};

const handleServerError = (err, req, res, next) => {
  console.error("Error:", err);
  return res.status(500).json({ msg: "Internal server error" });
};

module.exports = { handleNotFoundError, handleServerError };
