const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const jwt = require('jsonwebtoken')

const helper = require('./helper')
const userHelper = require('./user_test_helper')

const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')

/*
TODO
- post
  - test when user created second blog, the blog is APPENDED to the
    user blogs list
- test other methods

*/

// when setting headers, you have to call .set() AFTER calling .post()

beforeEach(async() => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  /*
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  */
})

const generateToken = (username, id) => {
  return jwt.sign({ username, id }, process.env.SECRET)
}

const createUser = async (user) => {
  const userToBeCreated = new User({ ...user })
  return await userToBeCreated.save()
}

describe('posting with invalid token', () => {
  test('posting without token returns unauthorized', async () => {
    const validBlogToPost = helper.initialBlogs[0]
    const response = await api
      .post('/api/blogs')
      .send(validBlogToPost)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('token required')
  })
  
  test('posting with invalid token returns unauthorized', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpbGlobyIsImlkIjoiNjUxOWNhZjc2OWYzMWZhNGQyNjAzMWZjIiwiaWF0IjoxNjk2MTg5MTk2fQ.tMhKLvC_WFsrZtEdYhVuNEOMmgajGEsXmrpGOcPody4'
    const validBlogToPost = helper.initialBlogs[0]
    await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${invalidToken}` })
      .send(validBlogToPost)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('posting with valid token', () => {
  test('created blog is returned', async () => {
    const createdUser = await createUser(userHelper.initialUsers[0])

    const validBlogToPost = helper.initialBlogs[0]
    const validToken = generateToken(createdUser.username, createdUser._id)
    const response = await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${validToken}` })
      .send(validBlogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const createdBlog = response.body
      expect(createdBlog.id).toBeDefined()
  
      expect(createdBlog.title).toBe(validBlogToPost.title)
      expect(createdBlog.author).toBe(validBlogToPost.author)
      expect(createdBlog.url).toBe(validBlogToPost.url)
      expect(createdBlog.likes).toBe(validBlogToPost.likes)
  })

  test('created blog has default zero likes', async () => {
    const createdUser = await createUser(userHelper.initialUsers[0])

    const validBlogToPost = helper.initialBlogs[1]
    expect(validBlogToPost.likes).not.toBeDefined()

    const validToken = generateToken(createdUser.username, createdUser._id)
    const response = await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${validToken}` })
      .send(validBlogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const createdBlog = response.body
      expect(createdBlog.likes).toBe(0)
  })

  // todo test also second 
  test('blog is added to the user with the token and that user is added to the blog', async () => {
    const createdUser = await createUser(userHelper.initialUsers[0])

    const validBlogToPost = helper.initialBlogs[0]
    const validToken = generateToken(createdUser.username, createdUser._id)
    const response = await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${validToken}` })
      .send(validBlogToPost)

      const createdBlog = response.body
      expect(createdBlog.user).toEqual(createdUser._id.toString())
      
      const user = await User.findById(createdUser._id)
      expect(user.blogs.map(blog => blog.toString())).toContain(createdBlog.id)
  })

  test('a blog without title is bad request', async () => {
    const createdUser = await createUser(userHelper.initialUsers[0])

    const invalidBlogToPost = {
      'author' : 'idiot posting without title',
      'url' : 'somewhere',
    }

    const validToken = generateToken(createdUser.username, createdUser._id)
    const response = await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${validToken}` })
      .send(invalidBlogToPost)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing title or url')
  })

  test('a blog without url is bad request', async () => {
    const createdUser = await createUser(userHelper.initialUsers[0])

    const invalidBlogToPost = {
      'title': 'when posting this, it is bad',
      'author' : 'idiot posting without title',
    }

    const validToken = generateToken(createdUser.username, createdUser._id)
    const response = await api
      .post('/api/blogs')
      .set({ 'Authorization': `Bearer ${validToken}` })
      .send(invalidBlogToPost)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing title or url')
  })
})

// todo with users and populate
/*
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
*/

/*
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
*/

// todo implement with tokens
/*
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
*/

afterAll(async() => {
  await mongoose.connection.close()
})