const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

// There are several ways of sending the token from the browser to
// the server. We will use the Authorization header. The header also
// tells which authentication scheme is used.
//
// The Bearer scheme is suitable for our needs
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// populate not tested, test also that correct values are shown
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    // populate user but do not show users blogs
    .populate('user', { blogs: 0 })

  response.json(blogs)
})

// adding user not tested
blogsRouter.post('/', async (request, response) => {
  // The validity of the token is checked
  //
  // The method also decodes the token, or returns the Object which
  // the token was based on
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const body = request.body
  if (!body.title || !body.url) {
    return response
      .status(400)
      .send({ error: 'missing title or url' })
  }

  body.likes = body.likes || 0
  body.user = user._id

  const blog = new Blog(body)
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// todo implement with token and test
blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const likes = request.body.likes

  if (!id || !likes) {
    return response.status(400).send(
      { error: 'id and likes must be present' }
    )
  }

  const updatedNote = await Blog.findByIdAndUpdate(
    id, { 'likes': likes}, { new: true }
  )
  response.json(updatedNote)
})

// todo implement with token and test
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)

  response.status(204).end()
})

module.exports = blogsRouter