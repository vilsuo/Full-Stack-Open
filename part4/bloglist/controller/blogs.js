const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

// todo remove next in routes

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!body.title || !body.url) {
    return response
      .status(400)
      .send({ error: 'missing title or url' })
  }

  body.likes = body.likes || 0
  const blog = new Blog(body)
  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  const likes = request.body.likes

  if (!id || !likes) {
    return response.status(400).send(
      { error: 'id and likes must be present' }
    )
  }

  try {
    const updatedNote = await Blog.findByIdAndUpdate(
      id, { 'likes': likes}, { new: true }
    )
    response.json(updatedNote)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter