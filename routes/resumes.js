const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const { ensureAuth } = require("../middleware/auth");

// CREATE
router.get("/new", ensureAuth, resumeController.resume_create_get);
router.post("/new", ensureAuth, resumeController.resume_create_post);

// READ
router.get("/", resumeController.resume_list_get);
router.get("/:id", resumeController.resume_detail_get);

// UPDATE
router.get("/:id/edit", ensureAuth, resumeController.resume_update_get);
router.put("/:id", ensureAuth, resumeController.resume_update_post);

// DELETE
router.delete("/:id/delete", ensureAuth, resumeController.resume_delete);

module.exports = router;
