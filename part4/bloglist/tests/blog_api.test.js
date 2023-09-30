const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./helper')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

beforeEach(async() => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('get all', () => {
  test('returned content type is json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('property _id is replaced with property id', async() => {
    const response = await api.get('/api/blogs')

    for (const blog of response.body) {
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    }
  })
})

describe('post', () => {
  test('when posting blog with all properties present, the response contains ' +
  'the posted blog', async () => {

    const blogToPost = {
      'title' : 'my new blog',
      'author' : 'me',
      'url' : 'somenewurl',
      'likes' : 0
    }

    const response = await api
      .post('/api/blogs')
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const returnedBlog = response.body
    expect(returnedBlog.title).toEqual(blogToPost.title)
    expect(returnedBlog.id).toBeDefined()
  })

  test('after posting a blog with all properties present, the posted a ' +
  'blog can be found amongst all blogs', async () => {

    const blogToPost = {
      'title' : 'my new blog',
      'author' : 'me',
      'url' : 'somenewurl',
      'likes' : 0
    }

    await api
      .post('/api/blogs')
      .send(blogToPost)

    // total blog number is incremented
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length)
      .toEqual(helper.initialBlogs.length + 1)

    // posted blogs title can be found
    expect(blogsAtEnd.map(blog => blog.title))
      .toContain(blogToPost.title)
  })

  test('if the blog to be posted does not have the property likes, then it is ' +
  'assigned zero likes', async () => {
    const blogWithoutPropertyLikes = {
      'title' : 'no likes',
      'author' : 'me',
      'url' : 'somenewurlsomewhere'
    }

    const response = await api
      .post('/api/blogs')
      .send(blogWithoutPropertyLikes)

    const likes = response.body.likes
    expect(likes).toBeDefined()
    expect(likes).toBe(0)
  })

  test('blog with missing title property is bad request', async () => {
    const blogWithoutTitle = {
      'author' : 'me',
      'url' : 'aposttestwithouttitle',
      'likes' : 0
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400)
  })

  test('blog with missing url property is bad request', async () => {
    const blogWithoutUrl = {
      'title': 'a post test without url',
      'author' : 'me',
      'likes' : 0
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400)
  })
})

afterAll(async() => {
  await mongoose.connection.close()
})