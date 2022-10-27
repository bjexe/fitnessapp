const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const workoutsRouter = require('./controllers/workouts')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info(`connected to database`)
    })
    .catch((err) => {
        logger.error(`error connecting to database: ${err.message}`)
    })

app.use(cors)
app.use(express.static('build'))
app.use(express.json)
app.use(middleware.requestLogger)

app.use('/api/workouts', workoutsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app