var express = require('express');
var router = express.Router();
var resumeController = require("../controllers/resumeController")

// GET list of resumes
router.get("/", resumeController.catalog);