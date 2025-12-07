const express = require("express");
const router = express.Router();

// GET /api - API info
router.get("/", function (req, res) {
  res.json({
    message: "Resume Builder API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      resumes: "/api/resumes",
    },
  });
});

module.exports = router;
