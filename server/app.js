const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const PORT = 5005
const cors = require('cors')
const Cohort = require('./cohort.js')
const Student = require('./student.js')

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose
  .connect('mongodb://127.0.0.1:27017/cohorts')
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to MongoDB', err))

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    origin: ['http://localhost:5173']
  })
)
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

const cohorts = require('./cohorts.json')
const students = require('./students.json')

app.get('/docs', (req, res) => {
  res.sendFile(__dirname + '/views/docs.html')
})

app.get('/api/cohorts', (req, res) => {
  res.json(cohorts)
})

app.get('/api/students', (req, res) => {
  res.json(students)
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
