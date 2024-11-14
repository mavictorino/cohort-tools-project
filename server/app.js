const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const PORT = 5005;
const cors = require('cors');
const app = express();
const Cohorts = require('./cohorts.js');
const Students = require('./students.js');
const mongoose = require('mongoose');
const { errorHandler, notFoundHandler } = require("./middleware/error-handling");

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/cohorts')
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173']
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes

app.get('/docs', (req, res) => {
  res.sendFile(__dirname + '/views/docs.html');
});

// Cohort Routes

// Get all cohorts
app.get('/api/cohorts', (req, res, next) => {
  Cohorts.find()
    .then(allCohorts => {
      res.status(200).json(allCohorts);
    })
    .catch(error => { 
      next(error)
    });
});

// Get a single cohort by ID
app.get('/api/cohorts/:id', (req, res, next) => {
  Cohorts.findById(req.params.id)
    .then(cohort => {
      res.status(200).json(cohort);
    })
    .catch(error => { 
      next(error)
    });
});

// Create a new cohort
app.post('/api/cohorts', (req, res, next) => {
  Cohorts.create({
    inProgress: req.body.inProgress,
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours
  })
    .then(newCohort => {
      res.status(201).json(newCohort);
    })
    .catch(error => { 
      next(error)
    });
});

// Update a cohort
app.put('/api/cohorts/:id', (req, res, next) => {
  Cohorts.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedCohort => {
      res.status(200).json(updatedCohort);
    })
    .catch(error => {
      next(error)
    });
});

// Delete a cohort
app.delete("/api/cohorts/:id", (req, res, next) => {
  Cohorts.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).send();
    })
    .catch(error => { 
      next(error)
    });
});

// Student Routes

// Get all students with populated cohort data
app.get('/api/students', (req, res, next) => {
  Students.find()
    .populate('cohort')
    .then(allStudents => {
      res.status(200).json(allStudents);
    })
    .catch(error => { 
      next(error)
    });
});

// Get students by cohort ID with populated cohort data
app.get('/api/students/cohort/:cohortId', (req, res, next) => {
  Students.find({ cohort: req.params.cohortId })
    .populate('cohort')
    .then(studentsByCohort => res.status(200).json(studentsByCohort))
    .catch(error => { 
      next(error)
    });
  });

// Get a single student by ID with populated cohort data
app.get("/api/students/:id", (req, res, next) => {
  Students.findById(req.params.id)
    .populate('cohort')    
    .then(student => {
      res.status(200).json(student);
    })
    .catch(error => { 
      next(error)
    });
});

// Create a new student
app.post('/api/students', (req, res, next) => {
  Students.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects
  })
    .then(newStudent => {
      res.status(201).json(newStudent);
    })
    .catch(error => { 
      next(error)
    });
});

// Update a student
app.put('/api/students/:id', (req, res, next) => {
  Students.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedStudent => {
      res.status(200).json(updatedStudent);
    })
    .catch(error => { 
      next(error)
    });
});

// Delete a student
app.delete("/api/students/:id", (req, res, next) => {
  Students.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).send();
    })
    .catch(error => { 
      next(error)
    });
});

//Error handling 
app.use(errorHandler);
app.use(notFoundHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


