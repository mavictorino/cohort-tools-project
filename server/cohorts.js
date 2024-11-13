const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cohortsSchema = new Schema({
  cohortSlug: { type: String, required: true, unique: true },
  cohortName: { type: String, required: true },
  program: { type: String, required: true },
  format: { type: String, enum: ['Full Time', 'Part Time'] },
  campus: {
    type: String,
    enum: [
      'Madrid',
      'Barcelona',
      'Miami',
      'Paris',
      'Berlin',
      'Amsterdam',
      'Lisbon',
      'Remote'
    ]
  },
  startDate: { type: Date, default: Date.now() },
  endDate: Date,
  inProgress: { type: Boolean, default: false },
  programManager: { type: String, required: true },
  leadTeacher: { type: String, required: true },
  totalHours: { type: Number, default: 360 }
})
module.exports = mongoose.model('Cohorts', cohortsSchema)
