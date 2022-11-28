const workoutsRouter = require('express').Router()
const Workout = require('../models/workout')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/auth')

// get all workouts
workoutsRouter.get(`/`, (request, response) => {
    Workout.find({}).then(workouts => {
        response.json(workouts)
    }).catch(err => console.log(err))
})

//get all workouts associated with a specific user
workoutsRouter.get(`/user`, async (request, response) => {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        reponse.status(401).json({error: "token is missing or invalid"})
    }
    const user = await User.findById(decodedToken.id)
    const workouts = await Workout.find({
        _id: {
            $in: user.workouts
        }
    })
    response.json(workouts)
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

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({error: "Token is either invalid or missing"})
    }

    if(!exercises) {
        return response.status(400).send({error: "workout must include some form of exercises"})
    }
    const workout = new Workout({
        date: new Date(),
        user: userId,
        exercises: body.exercises
    })
    const user = User.findById(decodedToken.id)
    const savedWorkout = await workout.save()
    user.workouts = user.workouts.concat(savedWorkout._id)
    await user.save()
    response.json(savedWorkout)
})

module.exports = workoutsRouter