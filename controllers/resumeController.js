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
    // Parse skills if they come as array from form
    let skills = req.body.skills || [];
    if (!Array.isArray(skills)) {
      skills = [skills];
    }
    skills = skills.filter(s => s && s.trim() !== '');

    const resumeData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      summary: req.body.summary,
      skills: skills,
      experience: req.body.experience || [],
      education: req.body.education || [],
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
    const resumes = await Resume.find()
      .select("fullName email createdAt updatedAt")
      .sort({ updatedAt: -1 }); // Show newest first

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
      title: `${resume.fullName}'s Resume`,
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
    
    if (!resume) {
      return res.status(404).render("error", {
        message: "Resume not found",
        error: { status: 404 },
      });
    }
    
    res.render("resume_form", {
      title: "Edit Resume",
      resume: resume,
      errors: null,
    });
  } catch (err) {
    console.error("Error loading resume for edit:", err);
    res.status(500).render("error", {
      message: "Error loading resume",
      error: err,
    });
  }
};

exports.resume_update_post = async (req, res) => {
  try {
    // Parse skills if they come as array from form
    let skills = req.body.skills || [];
    if (!Array.isArray(skills)) {
      skills = [skills];
    }
    skills = skills.filter(s => s && s.trim() !== '');

    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      summary: req.body.summary,
      skills: skills,
      experience: req.body.experience || [],
      education: req.body.education || [],
      updatedAt: Date.now(),
    };

    // FIX: This was missing the updateData parameter!
    await Resume.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.redirect(`/resumes/${req.params.id}`);
  } catch (err) {
    console.error("Error updating resume:", err);
    
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
    const resume = await Resume.findByIdAndDelete(req.params.id);
    
    if (!resume) {
      return res.status(404).render("error", {
        message: "Resume not found",
        error: { status: 404 },
      });
    }
    
    res.redirect("/resumes");
  } catch (err) {
    console.error("Error deleting resume:", err);
    res.status(500).render("error", {
      message: "Error deleting resume",
      error: err,
    });
  }
};
