//this needs work

const usersRouter = require('express').Router()
const User = require('../models/user')

// create an account
usersRouter.post(`/`, (request, response) => {
    const body = request.body
    const user = new User({
        username: body.username,
        password: body.password,
        workouts: []
    })
    user.save().then(savedUser => { //perhaps research a different implementation here
        response.json(savedUser)
    })
})

// delete an account
usersRouter.delete(`/:userId`, (request, response) => {
    User.findByIdAndRemove(request.params.userId).then(response.status(204)).catch(err => console.log(err))
})

module.exports = usersRouter