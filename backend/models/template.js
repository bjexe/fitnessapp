const mongoose = require('mongoose')
const exerciseSchema = require('./schemas/exercise')

const templateSchema = new mongoose.Schema({
    name: String,
    finished: Boolean,
    exercises: [exerciseSchema]
})

templateSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj.id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Template', templateSchema)