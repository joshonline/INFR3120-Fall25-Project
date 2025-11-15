var Resume = require("../models/resume");

exports.catalog = async (req, res) => {
  const resumes = await Resume.find().select(
    "fullName email createdAt updatedAt"
  );

  res.render("resume_list.ejs", {
    tile: "All Resumes",
    resume_list: resumes,
  });
};
