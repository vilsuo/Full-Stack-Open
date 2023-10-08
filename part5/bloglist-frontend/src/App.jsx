import { useEffect } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import { initializeBlogs } from './reducers/blogsReducer'

import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import { initializeUser, removeUser } from './reducers/userReducer'

// notification clears too quickly if old notification message
// is still present

const App = () => {
  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  // see if user is saved to local storage
  useEffect(() => {
    dispatch(initializeUser())
  }, [])

  // get all blogs
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const handleLogout = () => {
    dispatch(removeUser())
  }

  if (user === null) {
    return <LoginForm />
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
      <BlogList />
    </div>
  )
}

export default App
