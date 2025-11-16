var Resume = require("../models/resume");

// Resume creation
exports.resume_create_get = (req, res) => {
  res.render("resume_form", {
    title: "Create New Resume",
    resume: null,
    errors: null,
  });
};

exports.resume_create_post = async (req, res) => {
  const resumeData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location,
    summary: req.body.summary,
    skills: req.body.skills,
  };
};

// Resume reading
exports.resume_list_get = async (req, res) => {
  const resumes = await Resume.find().select(
    "fullName email createdAt updatedAt"
  );

  res.render("resume_list", {
    title: "All Resumes",
    resumes: resumes,
  });
};

exports.resume_detail = async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).render("error", {
      message: "Resume not found",
      error: { status: 404 },
    });
  }

  res.render("resume_detail", {
    title: `${resume.fullName}"'s Resume`,
    resume: resume,
  });
};

// Resume updating
exports.resume_update_get = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  res.render("resume_form", {
    title: "Edit Resume",
    resume: resume,
    errors: null,
  });
};

exports.resume_update_post = async (req, res) => {
  await Resume.findByIdAndUpdate(req.params.id);
  res.redirect(`/resumes/${req.params.id}`);
};

// Resume deletion
exports.resume_delete = async (req, res) => {
  await Resume.findByIdAndDelete(req.params.id);
  res.redirect("/resumes");
};
