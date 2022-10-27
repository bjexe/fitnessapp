const mongoose = require('mongoose')
const exerciseSchema = require('./exercise')

const workoutSchema = new mongoose.Schema({
    date: Date,
    exercises: [exerciseSchema]
})

workoutSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = workoutSchema