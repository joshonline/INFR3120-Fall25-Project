const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resumeSchema = new Schema({
  // ✅ ADD THIS: Link resume to user
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Rest of your existing schema...
  fullName: { type: String, required: true },
  email: String,
  phone: String,
  location: String,
  summary: String,

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

  education: [
    {
      degree: { type: String, required: true },
      school: String,
      graduationYear: String,
      courses: [String],
    },
  ],

  skills: [String],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

resumeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Resume", resumeSchema);
