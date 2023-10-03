import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggeable'
import Blog from './components/Blog'

// notification clears too quickly if old notification message
// is still present

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
    setMessageAndClearIt('logged out')
  }

  const addBlog = blog => {
    setBlogs(blogs.concat(blog))
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
      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel='create new blog'>
        <BlogForm
          addBlog={addBlog}
          messageSetter={setMessageAndClearIt}
        />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blogData={blog} />
       )
      }

    </div>
  )
}

export default App