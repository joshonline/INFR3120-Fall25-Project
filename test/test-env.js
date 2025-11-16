require("dotenv").config();
const mongoose = require("mongoose");

console.log(
  "🔗 Connecting to:",
  process.env.MONGODB_URI.replace(/\/\/.*:.*@/, "//***:***@")
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected!");
    console.log("📊 Database name:", mongoose.connection.name);
    console.log(
      "🎯 Environment:",
      mongoose.connection.name === "cv-dev" ? "DEVELOPMENT" : "PRODUCTION"
    );

    // Show collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📁 Collections:",
      collections.map((c) => c.name).join(", ") || "None yet"
    );

    // Show document count (if resumes collection exists)
    if (collections.some((c) => c.name === "resumes")) {
      const Resume = require("./models/resume");
      const count = await Resume.countDocuments();
      console.log("📄 Total resumes:", count);
    }

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  });
