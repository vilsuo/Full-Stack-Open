const blogsRouter = require('express').Router()
const middleWare = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

// TODO
// - populate user but do not show users blogs?
// - test populate
//    - test that correct values are shown
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { 'name': 1, 'username': 1 })

  response.json(blogs)
})

// test populate
// populate user to the returned value
blogsRouter.post('/', middleWare.userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(500).send({ error: 'user does not exist' })
  }

  const body = request.body
  if (!body.title || !body.url) {
    return response
      .status(400)
      .send({ error: 'missing title or url' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: []
  })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user', { 'name': 1, 'username': 1 })

  response.status(201).json(savedBlog)
})

// TODO
// - implement with token?
// - test
blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id

  const updatedNote = await Blog.findByIdAndUpdate(
    id,
    request.body,
    { new: true }
  )

  if (!updatedNote) {
    return response.status(400).send(
      { error: 'blog does not exist' }
    )
  }

  await updatedNote.populate('user', { 'name': 1, 'username': 1 })

  response.json(updatedNote)
})

// todo test
blogsRouter.post('/:id/comments', async (request, response) => {
  const id = request.params.id
  const { comment } = request.body

  const updatedNote = await Blog.findByIdAndUpdate(
    id,
    { $push: { comments: comment }},
    { new: true }
  )

  if (!updatedNote) {
    return response.status(400).send(
      { error: 'blog does not exist' }
    )
  }

  await updatedNote.populate('user', { 'name': 1, 'username': 1 })

  response.json(updatedNote)
})

// TODO
// - test
//    - non existing user
//    - with user that does not 'own' the blog
//    - non existing blog
//  - that blog is deleted also from the owner
blogsRouter.delete('/:id', middleWare.userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(500).send({ error: 'user does not exist' })
  }

  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(500).send({ error: 'blog does not exist' })
  }

  if (!user._id.equals(blogToDelete.user)) {
    return response.status(401).send({ error: 'this user can not delete this blog' })
  }

  await Blog.findByIdAndDelete(blogToDelete._id)

  // remove blog from the user also
  user.blogs = user.blogs.filter(blog => 
    !blog._id.equals(blogToDelete._id)
  )
  await user.save()

  response.status(204).end()
})

module.exports = blogsRouter