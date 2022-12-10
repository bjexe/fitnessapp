const mongoose = require('mongoose')
const settingsSchema = require('./schemas/settings')

const userSchema = new mongoose.Schema({
    username: String,
    settings: settingsSchema,
    name: String,
    passwordHash: String,
    weight: [{date: Date, value: Number}],
    workouts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}],
    templates: [{type: mongoose.Schema.Types.ObjectId, ref: 'Template'}]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)