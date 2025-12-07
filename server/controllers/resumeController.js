const Resume = require('../models/resume');

/**
 * GET /api/resumes
 * Get all resumes for current user
 */
exports.getResumes = async (req, res) => {
  try {
    // Only get resumes owned by current user
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('fullName email createdAt updatedAt');

    res.json({
      success: true,
      count: resumes.length,
      resumes: resumes
    });

  } catch (err) {
    console.error('Get resumes error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes'
    });
  }
};

/**
 * GET /api/resumes/:id
 * Get single resume by ID
 */
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id  // Ensure user owns this resume
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      resume: resume
    });

  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching resume'
    });
  }
};

/**
 * POST /api/resumes
 * Create new resume
 */
exports.createResume = async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user.id  // Associate resume with current user
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      resume: resume
    });

  } catch (err) {
    console.error('Create resume error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating resume'
    });
  }
};

/**
 * PUT /api/resumes/:id
 * Update resume
 */
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { 
        _id: req.params.id,
        user: req.user.id  // Ensure user owns this resume
      },
      req.body,
      { 
        new: true,  // Return updated document
        runValidators: true  // Run model validation
      }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to update it'
      });
    }

    res.json({
      success: true,
      message: 'Resume updated successfully',
      resume: resume
    });

  } catch (err) {
    console.error('Update resume error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating resume'
    });
  }
};

/**
 * DELETE /api/resumes/:id
 * Delete resume
 */
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id  // Ensure user owns this resume
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to delete it'
      });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });

  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting resume'
    });
  }
};