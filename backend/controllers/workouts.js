const workoutsRouter = require('express').Router()
const Workout = require('../models/workout')
const User = require('../models/user')

// get all workouts
workoutsRouter.get(`/`, (request, response) => {
    Workout.find({}).then(workouts => {
        response.json(workouts)
    }).catch(err => console.log(err))
})

//get all workouts associated with a specific user
workoutsRouter.get(`/:userId`, (request, response) => {
    Workout.find({userId: request.params.userId}).then(workouts => {
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
workoutsRouter.post(`/`, async (request, response) => {
    const {userId, exercises} = request.body
    if(!exercises) {
        return response.status(400).send({error: "workout must include some form of exercises"})
    }
    const workout = new Workout({
        date: new Date(),
        user: userId,
        exercises: body.exercises
    })
    const user = User.findById(userId)
    const savedWorkout = await workout.save()
    user.workouts = await user.workouts.concat(savedWorkout._id)
    response.json(savedWorkout)
})

module.exports = workoutsRouter