const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require('../db/queries');
const { verifyPassword } = require("../utilis/password");

passport.use(
  new LocalStrategy( async(username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);

      if (!user)
        return done(null, false, {
          message: "Incorrect username or password",
        });

      const isPasswordValid = verifyPassword(password, user.password);

      if (!isPasswordValid)
        return done(null, false, { message: "Incorrect username or password" });
      else {
        return done(null, user);
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await db.getUserById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
