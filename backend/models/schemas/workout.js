const mongoose = require('mongoose')
const exerciseSchema = require('./exercise')

const workoutSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    exercises: [exerciseSchema]
})

workoutSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.user
    }
})

module.exports = workoutSchema