const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcryptjs')
const { isAuthenticated } = require('../middleware/jwt.middleware')
const User = require('../models/User.model')
const router = express.Router()
const saltRounds = 10

// POST /auth/signup - Handles user signup
router.post('/signup', (req, res, next) => {
  const { email, password, name } = req.body

  // Validate email, password, and name are not empty
  if (email === '' || password === '' || name === '') {
    res.status(400).json({ message: 'Provide email, password, and name' })
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address' })
    return
  }

  // Validate password strength
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters, including uppercase, lowercase, and a number.'
    })
    return
  }

  // Check if the email is already in use
  User.findOne({ email })
    .then(foundUser => {
      if (foundUser) {
        res.status(400).json({ message: 'User already exists.' })
        return
      }

      // Generate salt
      const salt = bcrypt.genSaltSync(saltRounds)

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, salt)

      // Create a new user
      return User.create({ email, password: hashedPassword, name })
    })
    .then(createdUser => {
      // Deconstruct user to omit the password
      const { _id, email, name } = createdUser

      // Generate JWT token
      const payload = { _id, email, name }
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h'
      })

      // Send the response with sanitized user details and token
      res.status(201).json({ user: { _id, email, name }, authToken })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    })
})

// POST /auth/login - Verifies email and password and returns a JWT
router.post('/login', (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password are not empty
  if (email === '' || password === '') {
    res.status(400).json({ message: 'Provide email and password.' })
    return
  }

  // Check if the user exists
  User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) {
        res.status(401).json({ message: 'User not found.' })
        return
      }

      // Validate the password
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password)

      if (!passwordCorrect) {
        res.status(401).json({ message: 'Unable to authenticate the user' })
        return
      }

      // Create a token payload
      const { _id, email, name } = foundUser
      const payload = { _id, email, name }
      console.log(payload)

      // Sign the token
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h'
      })
      console.log('Generated Token:', authToken)
      // Send the token
      res.status(200).json({ authToken })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    })
})

router.get('/verify', isAuthenticated, (req, res, next) => {
  console.log(req.payload, 'this is req.payload')
  res.json(req.payload)
})

module.exports = router
