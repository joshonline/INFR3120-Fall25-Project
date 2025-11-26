Resume Builder Web Application

A full-stack web application for creating and managing professional resumes. Built for **INFR3120 - Web and Scripting Programming** course.
## Overview

This project provides a complete CRUD system for resume management with an intuitive interface. Users can create, view, edit, and delete resumes with sections for personal information, work experience, education, and skills.

## Live Link:
https://infr3120-fall25-project-yjny.onrender.com/ 

## Key Features

- Create resumes with dynamic form fields
- View resumes in professional format with statistics
- Edit existing resumes with pre-populated forms
- Delete resumes with confirmation
- Print/export to PDF functionality
- Responsive design (mobile-friendly)
- Real-time completeness calculator
- Dynamic skills, experience, and education sections

##  Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Frontend:** EJS, HTML5, CSS3, JavaScript  
**Tools:** Nodemon, Morgan, Method-Override, dotenv

##  Quick Start

1. **Clone and install**
    
    ```bash
    git clone https://github.com/joshonline/INFR3120-Fall25-Project.git
    cd INFR3120-Fall25-Project
    npm install
    ```
    
2. **Configure environment**
    
    Create `.env` file:
    
    ```env
    MONGODB_URI=mongodb://localhost:27017/resume-builder
    PORT=3000
    ```
    
3. **Run the application**
    
    ```bash
    npm run dev    # Development with auto-restart
    npm start      # Production
    ```
    
4. **Access at** `http://localhost:3000`
    

## Project Structure

```
├── config/database.js           # MongoDB connection
├── controllers/resumeController.js  # CRUD operations
├── models/resume.js             # Resume schema
├── routes/resumes.js            # API endpoints
├── views/
│   ├── index.ejs               # Landing page
│   ├── resume_form.ejs         # Create/Edit form
│   ├── resume_detail.ejs       # Single resume view
│   └── resume_list.ejs         # All resumes list
└── app.js                      # Express configuration
```

##  API Routes

|Method|Route|Description|
|---|---|---|
|GET|`/resumes`|List all resumes|
|GET|`/resumes/new`|Create resume form|
|POST|`/resumes/new`|Create new resume|
|GET|`/resumes/:id`|View single resume|
|GET|`/resumes/:id/edit`|Edit resume form|
|PUT|`/resumes/:id`|Update resume|
|PUT|`/resumes/:id/delete`|Delete resume|

##  Database Schema

```javascript
{
  fullName: String (required),
  email: String,
  phone: String,
  location: String,
  summary: String,
  experience: [{ title, company, startDate, endDate, description }],
  education: [{ degree, school, graduationYear }],
  skills: [String],
  createdAt: Date,
  updatedAt: Date
}
```

##  Troubleshooting

**MongoDB Connection Error:** Ensure MongoDB is running or check Atlas connection string  
**Port In Use:** Change port in `.env` or kill process on port 3000  
**Module Not Found:** Run `npm install`  
**PUT/DELETE Not Working:** Verify `method-override` is installed

##  Team Members

- **[Adyan Iqbal]** - Resume Creation & Management
  - API and Frontend
- **[Joshua Masanza]** - Initialized Project and worked on Backend
- **[Shaheer Ahson]** - Basics for landing page and Dashboard
- Frontend


## Future Enhancements

- User authentication
- Multiple resume templates
- Export to Word/PDF
- Share via unique link
- AI-powered suggestions

---

**INFR3120 | November 2025**
