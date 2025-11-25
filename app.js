var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var methodOverride = require("method-override");
const connectDB = require("./config/database");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var resumesRouter = require("./routes/resumes");

// Import user auth packages
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

var app = express();

connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ------SESSIONS-------
// express-session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGDB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 360000,
    },
  })
);

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

app.use(passport.initialize());
app.use(passport.session());

//TASK: Add users/login route, add visit count logic to route
// TASK: Protect routes
// -----------------

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/resumes", resumesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
