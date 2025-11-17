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
  try {
    const resumeData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      summary: req.body.summary,
      skills: req.body.skills,
      experience: req.body.experience || [],
      education: req.body.education || [],
      updatedAt: Date.now(),
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.redirect(`/resumes/${resume._id}`);
  } catch (err) {
    console.error("Error creating resume:", err);

    res.render("resume_form", {
      title: "Create New Resume",
      resume: req.body,
      errors: err.errors,
    });
  }
};

// Resume reading
exports.resume_list_get = async (req, res) => {
  try {
    const resumes = await Resume.find().select(
      "fullName email createdAt updatedAt"
    );

    res.render("resume_list", {
      title: "All Resumes",
      resumes: resumes,
    });
  } catch (err) {
    console.error("Error fetching resumes:", err);

    res.status(500).render("error", {
      message: "Error loading resumes",
      error: err,
    });
  }
};

exports.resume_detail_get = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error fetching resume:", err);

    res.status(500).render("error", {
      message: "Error loading resume",
      error: err,
    });
  }
};

// Resume updating
exports.resume_update_get = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    res.render("resume_form", {
      title: "Edit Resume",
      resume: resume,
      errors: null,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.resume_update_post = async (req, res) => {
  try {
    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      summary: req.body.summary,
      skills: req.body.skills,
      experience: req.body.experience || [],
      education: req.body.education || [],
      updatedAt: Date.now(),
    };
    await Resume.findByIdAndUpdate(req.params.id);
    res.redirect(`/resumes/${req.params.id}`);
  } catch (err) {
    console.log("Error updating resume:", err);
    const resume = await Resume.findById(req.params.id);
    res.render("resume_form", {
      title: "Edit Resume",
      resume: resume,
      errors: err.errors,
    });
  }
};

// Resume deletion
exports.resume_delete = async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.redirect("/resumes");
  } catch (err) {
    console.log("Error deleteing resume:", err);
    res.status(500).send(err.message);
  }
};
