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
app.use('/api', require('./routes/cohorts.routes.js'));



//Error handling 
app.use(errorHandler);
app.use(notFoundHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


