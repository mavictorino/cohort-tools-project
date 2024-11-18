const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Students = require('../models/Students.model')
const Cohorts = require('../models/Cohorts.model')
const { isAuthenticated } = require('../middleware/jwt.middleware');


// Get all cohorts
router.get('/cohorts', isAuthenticated, (req, res, next) => {
    Cohorts.find()
      .then(allCohorts => {
        res.status(200).json(allCohorts);
      })
      .catch(error => { 
        next(error)
      });
  });
  
  // Get a single cohort by ID
  router.get('/cohorts/:id', isAuthenticated, (req, res, next) => {
    Cohorts.findById(req.params.id)
      .then(cohort => {
        res.status(200).json(cohort);
      })
      .catch(error => { 
        next(error)
      });
  });
  
  // Create a new cohort
  router.post('/cohorts', isAuthenticated, (req, res, next) => {
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
  router.put('/cohorts/:id', isAuthenticated, (req, res, next) => {
    Cohorts.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedCohort => {
        res.status(200).json(updatedCohort);
      })
      .catch(error => {
        next(error)
      });
  });
  
  // Delete a cohort
  router.delete("/cohorts/:id", isAuthenticated, (req, res, next) => {
    Cohorts.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(204).send();
      })
      .catch(error => { 
        next(error)
      });
  });
  


module.exports = router;