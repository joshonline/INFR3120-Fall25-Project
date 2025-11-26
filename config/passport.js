const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        try {
          // Find user in MongoDB by username
          const user = await User.findOne({ username: username });

          // User not found
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          // Check if password matches (using bcrypt comparison from User model)
          const isMatch = await user.comparePassword(password);

          if (!isMatch) {
            return done(null, false, { message: "Invalid password" });
          }

          // Authentication successful
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Serialize user - store user ID in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user - retrieve user from database using ID from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
