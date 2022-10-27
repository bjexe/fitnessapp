const templatesRouter = require('express').Router()
const Template = require('./models/template')

// getting all templates
templatesRouter.get(`/`, (request, response) => {
    Template.find({}).then(templates => {
        response.json(templates)
    })
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
templatesRouter.delete(`/:id`, (request, response) => {
    Template.findByIdAndRemove(request.params.id)
        .then(response.status(204).end())
        .catch(err => console.log(err))
})

// update a template by id
templatesRouter.put(`/:id`, (request, response) => {
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
templatesRouter.post(`/`, (request, response) => {
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

module.exports = templatesRouter