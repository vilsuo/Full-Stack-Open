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

describe('delete', () => {
  test('deleted blog can not be found', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    
    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1
    )

    expect(blogsAtEnd)
      .not.toContainEqual(blogToDelete)
  })

  test('deleting blog with non-existing id returns no content', async () => {
    const nonExistingId = await helper.nonExistingId()
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(204)
  })

  test('deleting with malformatted id returns bad request', async () => {
    await api
      .delete(`/api/blogs/${helper.malformattedId}`)
      .expect(400)
  })
})

describe('post', () => {
  test('when posting blog with all properties present, the response contains the posted blog', async () => {
    const blogToPost = helper.nonExistingBlog

    const response = await api
      .post('/api/blogs')
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const returnedBlog = response.body
    expect(returnedBlog.title).toEqual(blogToPost.title)
    expect(returnedBlog.id).toBeDefined()
  })

  test('after posting a blog with all properties present, the posted a blog can be found amongst all blogs', async () => {
    const blogToPost  = helper.nonExistingBlog

    const response = await api
      .post('/api/blogs')
      .send(blogToPost)

    // total blog number is incremented
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd)
      .toHaveLength(helper.initialBlogs.length + 1)

    // posted blogs title can be found
    expect(blogsAtEnd)
      .toContainEqual(response.body)
  })

  test('if the blog to be posted does not have the property likes, then it is assigned zero likes', async () => {
    const blogWithoutPropertyLikes = { ...helper.nonExistingBlog }
    delete blogWithoutPropertyLikes.likes

    const response = await api
      .post('/api/blogs')
      .send(blogWithoutPropertyLikes)

    const likes = response.body.likes
    expect(likes).toBe(0)
  })

  test('blog with missing title property is bad request', async () => {
    const blogWithoutTitle = { ...helper.nonExistingBlog }
    delete blogWithoutTitle.title

    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400)
  })

  test('blog with missing url property is bad request', async () => {
    const blogWithoutUrl = { ...helper.nonExistingBlog }
    delete blogWithoutUrl.url

    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400)
  })
})

describe('put', () => {
  test('response body contains updated blog with updated likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlogValues = helper.nonExistingBlog

    expect(blogToUpdate.likes).not.toBe(newBlogValues.likes)

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlogValues)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(newBlogValues.likes)
  })

  test('trying to without property likes is bad request', async () => {
    const blogToUpdate = await helper.blogsInDb()

    const newBlogValuesWithoutLikes = { ...helper.nonExistingBlog }
    delete newBlogValuesWithoutLikes.likes

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlogValuesWithoutLikes)
      .expect(400)
  })
})

afterAll(async() => {
  await mongoose.connection.close()
})