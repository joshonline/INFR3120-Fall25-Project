var express = require("express");
var router = express.Router();
var resumeController = require("../controllers/resumeController");

//CRUD ROUTES

// CREATE
// GET Request for resume creation
router.get("/new", resumeController.resume_create_get);
// POST Request for resume creation
router.post("/new", resumeController.resume_create_post);

// READ
// GET request for list of all resumes
router.get("/", resumeController.resume_list_get);
// GET Resquest for one resume
router.get("/:id", resumeController.resume_detail_get);

// UPDATE
// GET Request for update of one resume
router.get("/:id/edit", resumeController.resume_update_get);
// Update Request for update of one resume
router.put("/:id", resumeController.resume_update_post);

// DELETE
router.put('/:id/delete', resumeController.resume_delete);

module.exports = router;
