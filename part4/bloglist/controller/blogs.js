const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

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
  const body = request.body
  if (!body.title || !body.url) {
    return response
      .status(400)
      .send({ error: 'missing title or url' })
  }

  body.likes = body.likes || 0

  // temp start
  const users = await User.find({})
  const user = users[0]
  // temp end

  body.user = user._id

  const blog = new Blog(body)
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

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

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)

  response.status(204).end()
})

module.exports = blogsRouter