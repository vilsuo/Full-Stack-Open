import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

// notification clears too quickly if old notification message
// is still present

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  // get all blogs
  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs))  
  }, [])

  // see if user is saved to local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    setMessageAndClearIt('logged out')
  }

  const setMessageAndClearIt = newMessage => {
    setMessage(newMessage)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addBlog = blog => {
    setBlogs(blogs.concat(blog))
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

      <BlogForm
        addBlog={addBlog}
        messageSetter={setMessageAndClearIt}
      />

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App