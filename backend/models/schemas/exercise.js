const mongoose = require('mongoose')
const setSchema = require('./set')

const exerciseSchema = new mongoose.Schema({name: String, sets:[setSchema], comments: [String]})

exerciseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = exerciseSchema