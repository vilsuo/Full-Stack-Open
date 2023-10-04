const express = require('express')
const app = express()
require('express-async-errors')

const cors = require('cors')
const loginRouter = require('./controller/login')
const blogsRouter = require('./controller/blogs')
const usersRouter = require('./controller/users')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleWare = require('./utils/middleware')

const mongoose = require('mongoose')
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())

app.use(express.json())

// after json, before routes
app.use(middleWare.tokenExtractor)
app.use(middleWare.requestLogger)

// application takes the routers into use
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

// take this route into use only in test-mode
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controller/testing')
  app.use('/api/testing', testingRouter)
}

// after routes
app.use(middleWare.unknownEndpoint)

// last
app.use(middleWare.errorHandler)

module.exports = app