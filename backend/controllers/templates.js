const templatesRouter = require('express').Router()
const Template = require('../models/template')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/auth')

// getting all templates
templatesRouter.get(`/`, async (request, response) => {
    const templates = await Template.find({}).populate('user', {username: 1, name: 1})
    response.json(templates)
})

// getting a specific template by id
templatesRouter.get(`/:id`, (request, response) => {
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
templatesRouter.delete(`/del/:id`, async (request, response) => {
    // Template.findByIdAndRemove(request.params.id)
    //     .then(response.status(204).end())
    //     .catch(err => console.log(err))
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
    user.templates.pull({_id: request.params.id})
})

templatesRouter.delete(`/test`, async (request, response) => {
    //const templateId = request.params.id
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

    if(true) {
        const template = new Template({name: "testingtesting"})
        template.save().then(async (savedTemplate) => {
            //user.templates.push(savedTemplate.id)
            await User.findByIdAndUpdate(userId, {templates: user.templates.concat(savedTemplate._id)})
            const ret = {user, savedTemplate}
            response.status(200).json(ret)
        }).catch(err => console.log(err))
    }

    if(false) {
        //User.templates.pull({_id: 12345})
    }
})

// update a template by id
templatesRouter.put(`/:id`, (request, response) => {
    const body = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({error: "token is missing or invalid"})
    }
    if(!body.name || !body.exercises){
        return response.status(400).json({error: "missing required information (exercises and name can not be missing)"})
    }
    Template.findByIdAndUpdate(request.params.id, {
        name: body.name,
        finished: body.finished,
        exercises: body.exercises
    })
})

// posting a new template
templatesRouter.post(`/`, async (request, response) => {
    const body = request.body
    
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    
    if(!decodedToken.id) {
        return response.status(401).json({error: "token is either invalid or missing"})
    }

    if(!body.exercises){
        return response.status(400).json({error: "empty exercises"})
    }

    const user = await User.findById(decodedToken.id)
    const template = new Template({
        name: body.name,
        finished: body.finished,
        exercises: body.exercises,
        favorite: body.favorite === undefined ? false : body.favorite,
        user: user._id
    })
    
    const savedTemplate = await template.save()
    user.templates = user.templates.concat(savedTemplate._id)
    await user.save()
    response.json(savedTemplate)
})

module.exports = templatesRouter