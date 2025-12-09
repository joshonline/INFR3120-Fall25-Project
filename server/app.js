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


var app = express();

connectDB();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// CORS
app.use(
  cors({
    origin: [
      // "http://localhost:4200",
      "https://cv-client-infr3120-fall25.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// attempt to force CORS to apply preflight requests
app.options("*", cors())

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/resumes", resumesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // send error message
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
