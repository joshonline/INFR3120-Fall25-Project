//Define the DB schema for Resumes
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// models/Resume.js
const resumeSchema = new Schema({
  //personal details
  fullName: { type: String, required: true },
  email: String,
  phone: String,
  location: String,

  //personal summary
  summary: String,

  // work & volunteer experience
  experience: [
    {
      title: { type: String, required: true },
      company: String,
      startDate: String,
      endDate: String,
      description: String,
      skills: [String],
    },
  ],

  // education
  education: [
    {
      degree: { type: String, required: true },
      school: String,
      graduationYear: String,
      courses: [String],
    },
  ],

  //skills
  skills: [String],

  //resume timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

//Update `resumeSchema.updateAt` on save
resumeSchema.pre('save', function(next){
    this.updatedAt=Date.now()
    next();
});

module.exports = mongoose.model("Resume", resumeSchema,"CV-Dev-Cluster");