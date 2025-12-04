// const express = require("express");
// const router = express.Router();
// const resumeController = require("../controllers/resumeController");
// const { ensureAuth } = require("../middleware/auth");

// // CREATE
// router.get("/new", ensureAuth, resumeController.resume_create_get);
// router.post("/new", ensureAuth, resumeController.resume_create_post);

// // READ
// router.get("/", resumeController.resume_list_get);
// router.get("/:id", resumeController.resume_detail_get);

// // UPDATE
// router.get("/:id/edit", ensureAuth, resumeController.resume_update_get);
// router.put("/:id", ensureAuth, resumeController.resume_update_post);

// // DELETE
// router.delete("/:id/delete", ensureAuth, resumeController.resume_delete);

// module.exports = router;


//------------------------------------------------
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { requireAuth } = require('../middleware/auth');

// All resume routes require authentication
router.use(requireAuth);

// GET /api/resumes - List all user's resumes
router.get('/', resumeController.getResumes);

// POST /api/resumes - Create new resume
router.post('/', resumeController.createResume);

// GET /api/resumes/:id - Get single resume
router.get('/:id', resumeController.getResume);

// PUT /api/resumes/:id - Update resume
router.put('/:id', resumeController.updateResume);

// DELETE /api/resumes/:id - Delete resume
router.delete('/:id', resumeController.deleteResume);

module.exports = router;