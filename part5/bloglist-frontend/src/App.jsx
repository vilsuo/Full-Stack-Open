import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Users from './components/users/Users'
import User from './components/users/User'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogsView from './components/blogs/BlogsView'
import Blog from './components/blogs/Blog'

import { initializeBlogs } from './reducers/blogsReducer'
import { initializeUsers } from './reducers/usersReducer'

import { useDispatch, useSelector } from 'react-redux'
import { initializeUser } from './reducers/userReducer'
import NavBar from './components/NavBar'

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

  useEffect(() => {
    dispatch(initializeUsers())
  }, [])

  if (user === null) {
    return <LoginForm />
  }

  return (
    <div className='container'>
      <NavBar />
      <Notification />
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />}></Route>
        <Route path="/" element={<BlogsView />}></Route>
        <Route path="/blogs/:id" element={<Blog />}></Route>
      </Routes>
    </div>
  )
}

export default App
