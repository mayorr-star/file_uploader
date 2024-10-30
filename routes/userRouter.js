const { Router } = require("express");
const userController = require("../controllers/userController.js");
const passport = require("passport");

const router = Router();

router.post("/sign_up", userController.postUser);
router.post(
  "/sign_in",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/sign_in",
    failureMessage: true
  })
);

module.exports = router;
