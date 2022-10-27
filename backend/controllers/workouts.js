const workoutsRouter = require('express').Router()
const Workout = require('../models/workout')

workoutsRouter.get(`/`, (request, response) => {
    Workout.find({}).then(workouts => {
        response.json(workouts)
    }).catch(err => console.log(err))
})

//get all workouts associated with a specific user
workoutsRouter.get(`/:userId`, (request, response) => {
    Workout.find(userId = request.params.userId).then(workouts => {
        response.json(workouts)
    })
})

// get specific workout by id
workoutsRouter.get(`/:id`, (request, response) => {
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
workoutsRouter.post(`/`, (request, response) => {
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

module.exports = workoutsRouter