require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('build')) //for showing front-end
app.use(express.json())

const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(() => console.log('connected to database'))
    .catch(err => console.log(err))

const setSchema = new mongoose.Schema({weight: Number, reps: Number, comment: String})
const exerciseSchema = new mongoose.Schema({name: String, sets:[setSchema]})

const templateSchema = new mongoose.Schema({
    name: String,
    finished: Boolean,
    exercises: [exerciseSchema]
})

//turn the db _id into a string and set as id
templateSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj.id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

const Template = new mongoose.model('Template', templateSchema)

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
  
app.use(requestLogger)

// template apis ---------------------------------------------
// getting all templates
app.get(`/api/templates`, (request, response) => {
    Template.find({}).then(templates => {
        response.json(templates)
    })
})

// getting a specific template by id
app.get(`/api/templates/:id`, (request, response) => {
    Template.findById(request.params.id).then(template => {
        if(template) {
            response.json(template)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        console.log(err)
        response.status(400).send({error: "malformatted id"})
    })
})

// delete a template by id
app.delete(`/api/templates/:id`, (request, response) => {
    Template.findByIdAndRemove(request.params.id)
        .then(response.status(204).end())
        .catch(err => console.log(err))
})

// update a template by id
app.put(`/api/templates/:id`, (request, response) => {
    const body = request.body
    if(!body.name){
        return response.status(400).json({error: "missing name"})
    }
    Template.findByIdAndUpdate(request.params.id, {
        name: body.name,
        finished: body.finished,
        exercises: body.exercises
    })
})

// posting a new template
app.post(`/api/templates`, (request, response) => {
    const body = request.body
    if(!body.content){
        return response.status(400).json({error: "empty body"})
    }
    const template = new Template({
        name: body.name,
        finished: body.finished,
        exercises: body.exercises
    })
    template.save().then(savedTemplate => {
        response.json(savedTemplate)
    }).catch(err => console.log(error))
})

// workout apis ----------------------------------------------------------------
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

const Workout = new mongoose.model("Workout", workoutSchema)

// get all workouts
app.get(`/api/workouts`, (request, response) => {
    Workout.find({}).then(workouts => {
        response.json(workouts)
    }).catch(err => console.log(err))
})

//get all workouts associated with a specific user
app.get(`/api/workouts/:userId`, (request, response) => {
    Workout.find(userId = request.params.userId).then(workouts => {
        response.json(workouts)
    })
})

// get specific workout by id
app.get(`/api/workouts/:id`, (request, response) => {
    Workout.findById(request.params.id).then(res => {
        if(res) {
            response.json(res)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        console.log(err)
        response.status(400).send({error: "malformatted id"})
    })
})

// submitting a new workout
app.post(`/api/workouts`, (request, response) => {
    const body = request.body
    console.log(body)
    if(!body.exercises){
        response.status(400).send({error: "posting a workout must include exercises"})
    }
    const workout = new Workout({
        date: new Date(),
        exercises: body.exercises
    })
    workout.save().then(saved => {
        response.json(saved)
    })
})

// account api --------------------------------------------
const userSchema = new mongoose.Schema({
    workouts: [workoutSchema]
})

// create an account
app.post(`/api/users`, (request, response) => {
    const user = new User()
    user.save().then(savedUser => { //perhaps research a different implementation here
        response.json(savedUser)
    })
})

// delete an account
app.delete(`/api/users/:userId`, (request, response) => {
    User.findByIdAndRemove(request.params.userId).then(response.status(204)).catch(err => console.log(err))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})