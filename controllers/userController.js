const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { generatePassword } = require("../utilis/password");
const db = require("../db/queries");

const validateNewUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .escape(),
  body("email")
    .isEmail()
    .withMessage("Invalid email, please enteer a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must be between 8 and 50 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit")
    .matches(/[^\w\s]/)
    .withMessage("Password must contain at least one special character")
    .escape(),
  body("password_confirmation")
    .custom((value, { req }) => {
      {
        return value === req.body.password;
      }
    })
    .withMessage("Passwords do not match"),
];

const postUser = [
  validateNewUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        errors: errors.array(),
      });
    }
    const { username, email, password } = req.body;
    const hashPassword = generatePassword(password);
    await db.createUser(username, email, hashPassword);
    res.redirect("/sign_in");
  }),
];

module.exports = { postUser };