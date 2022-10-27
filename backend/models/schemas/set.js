const mongoose = require('mongoose')

const setSchema = new mongoose.Schema({weight: Number, reps: Number, comment: String})

setSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = setSchema