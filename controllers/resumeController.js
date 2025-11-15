var Resume = require("../models/resume");

exports.resume_catalog = async (req, res) => {
  const resumes = await Resume.find().select(
    "fullName email createdAt updatedAt"
  );

  res.render("resume_list", {
    title: "All Resumes",
    resumes: resumes,
  });
};
