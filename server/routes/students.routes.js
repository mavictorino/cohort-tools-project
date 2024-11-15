const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Students = require('../models/Students.model')
const Cohort = require('../models/Cohorts.model')

// Get all students with populated cohort data
router.get('/api/students', (req, res, next) => {
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
router.get('/api/students/cohort/:cohortId', (req, res, next) => {
    Students.find({ cohort: req.params.cohortId })
        .populate('cohort')
        .then(studentsByCohort => res.status(200).json(studentsByCohort))
        .catch(error => {
            next(error)
        });
});

// Get a single student by ID with populated cohort data
router.get("/api/students/:id", (req, res, next) => {
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
router.post('/api/students', (req, res, next) => {
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
router.put('/api/students/:id', (req, res, next) => {
    Students.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedStudent => {
            res.status(200).json(updatedStudent);
        })
        .catch(error => {
            next(error)
        });
});

// Delete a student
router.delete("/api/students/:id", (req, res, next) => {
    Students.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).send();
        })
        .catch(error => {
            next(error)
        });
});


module.exports = router;