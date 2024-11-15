require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const PORT = 5005;

const cors = require('cors');
const app = express();
const Cohorts = require('./models/Cohorts.model.js');
const Students = require('./models/Students.model.js');
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

app.use('/api', require('./routes/auths.routes.js'));
app.use('/api', require('./routes/students.routes.js'));



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



//Error handling 
app.use(errorHandler);
app.use(notFoundHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


