const LocalStrategy = require("passport-local").Strategy;

const passportConfig = (passport) => {
  // Define strategy
  passport.use(
    new LocalStrategy((username, password, done) => {
      const user = usersRouter.find((u) => u.username === username);
      if (!user) return done(null, false, { message: "User no found" });
      if (user.password !== password)
        return done(null, false, { message: "Invalid password" });
      return done(null, user);
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    done(null, user);
  });
};

module.exports = passportConfig;
