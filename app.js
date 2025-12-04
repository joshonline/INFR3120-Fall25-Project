const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const connectDB = require("./config/database");

const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const resumesRouter = require("./routes/resumes");

// DEPRECATED - Import user auth packages
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const passport = require("passport");

var app = express();

connectDB();

// DEPRECATED - view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// DEPRECATED--SESSIONS-------
// express-session setup
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//       collectionName: "sessions",
//     }),
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24,
//     },
//   })
// );

// require("./config/passport")(passport);
// app.use(passport.initialize());
// app.use(passport.session());

//TASK: Add users/login route, add visit count logic to route
// TASK: Protect routes
// -----------------

// app.use((req, res, next) => {
//   res.locals.user = req.user ? req.user : null;
//   next();
// });

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      // 'https://our-render-link' // Will add once deployed
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/resumes", resumesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// DEPRECATED - error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
