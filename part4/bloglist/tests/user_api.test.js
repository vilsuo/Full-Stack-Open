const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const User = require('../models/user')
const userHelper = require('./user_test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

const createUser = async (user) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(user.password, saltRounds)
  return new User({
    'name': user.name,
    'username': user.username,
    'passwordHash': passwordHash
  })
}

beforeEach(async () => {
  await User.deleteMany({})

  const userArray = await Promise.all(
    userHelper.initialUsers.map(user => createUser(user))
  )
  const users = await User.insertMany(userArray)
  //console.log('users', users)
})

// todo test error codes
describe('post', () => {
  test('valid user post', async () => {
    const validAndUniqueUser = userHelper.validNotTakenUser

    const usersAtStart = await userHelper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(validAndUniqueUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // name and username match to the values created with
    const returnedUser = response.body
    expect(returnedUser.name).toBe(validAndUniqueUser.name)
    expect(returnedUser.username).toBe(validAndUniqueUser.username)
    expect(returnedUser.blogs).toHaveLength(0)

    // password is not included in the response
    expect(returnedUser.password).not.toBeDefined()
    expect(returnedUser.passwordHash).not.toBeDefined()

    // user count is incremented
    const notesAtEnd = await userHelper.usersInDb()
    expect(notesAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('usernames must be unique', async () => {
    const usersAtstart = await userHelper.usersInDb()
    const takenUsername = usersAtstart[0].username

    const userWithTakenUsername = {
      ...userHelper.validNotTakenUser,
      username: takenUsername
    }

    const response = await api
      .post('/api/users')
      .send(userWithTakenUsername)
      .expect(400)
    
    expect(response.body.error)
      .toBe(
        'User validation failed: username: Error, expected ' +
        '`username` to be unique. Value: \`' + takenUsername + '`'
      )
  })

  test('too short username is bad request', async () => {
    const tooShortUsername = 'ju'
    const userWithTooShortUsername = {
      ...userHelper.validNotTakenUser,
      username: tooShortUsername
    }

    const response = await api
      .post('/api/users')
      .send(userWithTooShortUsername)
      .expect(400)

    expect(response.body.error)
      .toBe(
        'User validation failed: username: Path `username` (`' +
        tooShortUsername + '`) is shorter than the minimum ' +
        'allowed length (3).'
      )
  })

  test('too short password is bad request', async () => {
    const userWithTooShortPassword = {
      ...userHelper.validNotTakenUser,
      password: 'if'
    }

    const response = await api
      .post('/api/users')
      .send(userWithTooShortPassword)
      .expect(400)

    expect(response.body.error)
      .toBe('password must be atleast 3 letters long')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})