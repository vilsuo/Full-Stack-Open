import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Blog from './components/Blog'

// notification clears too quickly if old notification message
// is still present

// liking blog does not sort the array. only refreshing show the
// blogs in correct order (bad or not?)

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)

  // see if user is saved to local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // get all blogs
  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs))
  }, [])

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = async blogToAdd => {
    try {
      const createdBlog = await blogService.create(blogToAdd)
      setBlogs(blogs.concat(createdBlog))

      setMessageAndClearIt(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      )
      return true
    } catch (exception) {
      setMessageAndClearIt(exception.response.data.error)
      return false
    }
  }

  // todo set message
  const updateBlog = async (id, newBlogValues) => {
    try {
      const updatedBlog = await blogService.update(id, newBlogValues)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))

    } catch (exception) {
      console.log('exception in update', exception)
    }
  }

  // todo set message
  const removeBlog = async id => {
    console.log('blogToRemove')
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))

    } catch (exception) {
      console.log('exception in remove', exception)
    }
  }

  const setMessageAndClearIt = newMessage => {
    setMessage(newMessage)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <LoginForm setUser={setUser} />
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} />

      {user.name} logged in
      <button id='logout-button' onClick={handleLogout}>logout</button>

      <Togglable buttonLabel='create new blog'>
        <BlogForm
          addBlog={addBlog}
        />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            blog={blog}
            username={user.username}
          />
        )
      }

    </div>
  )
}

export default App