const bcrypt = require('bcrypt')
const userInfoRouter = require('express').Router()
const User = require('../models/user')
const getTokenFrom = require('../utils/auth')
const jwt = require('jsonwebtoken')

userInfoRouter.put('/weight', async (request, response) => {
    
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({error: "token is missing or invalid"})
    }
    const user = await User.findById(decodedToken.id)
    if(!user) {
        return response.status(400).json({
            error: 'User not found'
        })
    }

    const updatedUser = {
        ...user,
        weight: user.weight.push({value: request.body.value, date: new Date()})
    }


    User.findByIdAndUpdate(decodedToken.id, updatedUser, {new: true})
        .then(updated => {
            response.json(updated.weight)
        })

})

module.exports = userInfoRouter