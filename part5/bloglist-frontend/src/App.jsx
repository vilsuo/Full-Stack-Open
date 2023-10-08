import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import { initializeBlogs } from './reducers/blogsReducer'

import { useDispatch } from 'react-redux'
import BlogList from './components/BlogList'

// notification clears too quickly if old notification message
// is still present

// liking blog does not sort the array. only refreshing show the
// blogs in correct order (bad or not?)

const App = () => {
  const [user, setUser] = useState(null)
  //const [blogs, setBlogs] = useState([])

  const dispatch = useDispatch()

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
    dispatch(initializeBlogs())
  }, [])

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  /*
  const updateBlog = async (id, newBlogValues) => {
    try {
      const updatedBlog = await blogService.update(id, newBlogValues)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)))
    } catch (exception) {
      console.log('exception in update', exception)
    }
  }

  const removeBlog = async (id) => {
    console.log('blogToRemove')
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
    } catch (exception) {
      console.log('exception in remove', exception)
    }
  }
  */

  if (user === null) {
    return <LoginForm setUser={setUser}/>
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user.name} logged in
      <button id="logout-button" onClick={handleLogout}>
        logout
      </button>
      <Togglable buttonLabel="create new blog">
        <BlogForm />
      </Togglable>
      <BlogList user={user} />
      {/*
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            blog={blog}
            username={user.username}
          />
        ))}
        */}
    </div>
  )
}

export default App
