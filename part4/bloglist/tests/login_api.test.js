const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const userToBeCreated = {
    name: 'ville',
    username: 'viltsu',
    password: 'salisillis'
  }

  await api
    .post('/api/users')
    .send(userToBeCreated)
})

describe('loggin in', () => {
  test('loggin in with created account returns token', async () => {
    const name = 'ville'
    const username = 'viltsu'
    const response = await api
      .post('/api/login')
      .send({ username, password: 'salisillis' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBeDefined()
    expect(response.body.username).toBe(username)
    expect(response.body.name).toBe(name)
  })

  test('loggin in with wrong password returns unauthorized', async () => {
    const username = 'viltsu'
    const response = await api
      .post('/api/login')
      .send({ username, password: 'silisallis'})
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('invalid username or password')
  })

  test('loggin in with non-existing user returns unauthorized', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'vili', password: 'salainensalis'})
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('invalid username or password')
  })

  test('decrypted token contains username and id', async () => {
    const username = 'viltsu'
    const user = await User.findOne({ username })

    const response = await api
      .post('/api/login')
      .send({ username, password: 'salisillis' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET)

    expect(decodedToken.username).toBe(username)
    expect(decodedToken.id).toBe(user._id.toString())

    expect(decodedToken.password).not.toBeDefined()
    expect(decodedToken.passwordHash).not.toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})