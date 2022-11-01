const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    weight: [{date: Date, value: Number}],
    workouts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}], // store IDs of workouts for access to them from a user page
    templates: [{type: mongoose.Schema.Types.ObjectId, ref: 'Template'}] // also for templates
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