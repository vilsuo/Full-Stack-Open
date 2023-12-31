const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

const saltRounds = 10

const passwordMinLength = 3

// route not tested
// populate not tested
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { user: 0 })

    response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const {name, username, password} = request.body

  if (!password || password.length < passwordMinLength) {
    return response
      .status(400)
      .send({ error: `password must be atleast ${passwordMinLength} letters long` })
  }

  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    username,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter