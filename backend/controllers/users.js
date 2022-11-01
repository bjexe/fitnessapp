const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// create an account
usersRouter.post(`/`, async (request, response) => {

    const usernameRequirements = /(?=.{3, 20}$)[a-zA-Z0-9]*/ //bad regex

    const passwordRequirements = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    const {username, password, name} = request.body
    
    const existingUser = await User.findOne({username})

    /*if(!usernameRequirements.test(username)){
        return response.status(400).json({
            error: 'Username must be between 3 and 20 characters and must contain only letters and numbers'
        })
    }*/

    if(!passwordRequirements.test(password)){
        return response.status(400).json({
            error: 'Password is not strong enough. Password must contain at least: 8 characters, one upperchase letter, one lowercase letter, and one number'
        })
    }

    if(existingUser) {
        return response.status(400).json({
            error: 'Username must be unique (username is taken)'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds)
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
    const users = await User.find({}).populate('templates', {})
    response.json(users)
})

module.exports = usersRouter