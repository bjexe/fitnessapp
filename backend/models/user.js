const mongoose = require('mongoose')

const workoutSchema = require('./schemas/workout')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    workouts: [workoutSchema]
})

module.exports = mongoose.model('User', userSchema)