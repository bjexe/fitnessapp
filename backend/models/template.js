const mongoose = require('mongoose')
const exerciseSchema = require('./schemas/exercise')

const templateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    favorite: Boolean,
    exercises: [exerciseSchema]
})

templateSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.user
    }
})

module.exports = mongoose.model('Template', templateSchema)