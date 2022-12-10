const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
    view: String,
    units: String
})

settingsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = settingsSchema