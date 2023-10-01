
const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title' : 'http blog',
    'author' : 'me',
    'url' : 'someurl',
    'likes' : 1
  },
  {
    'title' : 'blog without likes property',
    'author' : 'me',
    'url' : 'otherurl',
  },
  {
    'title' : 'react blog',
    'author' : 'unknown',
    'url' : 'thirdurl',
    'likes' : 10
  }
]

const malformattedId = '6518183d6247d6748083692'

const nonExistingId = async () => {
  const blogToBeDeleted = new Blog({
    'title' : 'blog to be deleted',
    'author' : 'popular author',
    'url' : 'deletedurl',
    'likes' : 1
  })

  await blogToBeDeleted.save()
  await blogToBeDeleted.deleteOne()

  return blogToBeDeleted.toJSON().id
}

const nonExistingBlog = {
  'title' : 'my new blog',
  'author' : 'me',
  'url' : 'somenewurl',
  'likes' : 15
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, 
  malformattedId, 
  nonExistingId, 
  nonExistingBlog,
  blogsInDb
}