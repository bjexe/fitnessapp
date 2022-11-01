const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// create an account
usersRouter.post(`/`, async (request, response) => {

    const {username, password, name} = request.body
    
    const existingUser = await User.findOne({username})
    
    if(existingUser) {
        return response.status(400).json({
            error: 'Username must be unique'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

// delete an account
usersRouter.delete(`/:userId`, (request, response) => {
    User.findByIdAndRemove(request.params.userId).then(response.status(204)).catch(err => console.log(err))
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = usersRouter