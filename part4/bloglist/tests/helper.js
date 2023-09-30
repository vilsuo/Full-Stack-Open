
const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title' : 'http blog',
    'author' : 'me',
    'url' : 'someurl',
    'likes' : 0
  },
  {
    'title' : 'node blog',
    'author' : 'me',
    'url' : 'otherurl',
    'likes' : 3
  },
  {
    'title' : 'react blog',
    'author' : 'unknown',
    'url' : 'thirdurl',
    'likes' : 10
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}