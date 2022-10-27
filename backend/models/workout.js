const mongoose = require('mongoose')

const workoutSchema = require('./schemas/workout')

module.exports = mongoose.model('Workout', workoutSchema)