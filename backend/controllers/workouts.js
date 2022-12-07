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
        response.status(401).json({error: "token is missing or invalid"})
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
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!decodedToken.id) {
        return response.status(401).json({error: "Token is either invalid or missing"})
    }

    if(!body.exercises) {
        return response.status(400).json({error: "Error: empty workout"})
    }

    const workout = new Workout({
        name: body.name ? body.name : "Unnamed Workout",
        endDate: new Date(),
        startDate: body.startDate,
        user: decodedToken.id,
        exercises: body.exercises
    })
    const user = await User.findById(decodedToken.id)
    const savedWorkout = await workout.save()
    // console.log(user)
    user.workouts = user.workouts.concat(savedWorkout._id)
    await user.save()
    response.json(savedWorkout)
})

workoutsRouter.delete(`/:id`, async (request, response) => {
    const body = request.body
    const workoutId = request.params.id
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!decodedToken.id) {
        return response.status(401).json({error: "Token is either invalid or missing"})
    }

    const user = await User.findById(decodedToken.id)
    if(!user) {
        return response.status(400).json({
            error: 'User not found'
        })
    }
    
    await User.updateOne({_id: user.id}, {
        $pullAll: {
            workouts: [workoutId]
        }
    })

    await Workout.findByIdAndDelete(workoutId)

    response.status(200)

})

module.exports = workoutsRouter