import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'
import Notification from './Notification'
import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      // add user to local storage
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      // set token so user can post blogs etc.
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(showNotification(exception.response.data.error))
    }
  }

  return (
    <div id="login-form">
      <Notification id="login-form-notification" />
      <h2>Login to the application</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="login-username-input">
          <span>username</span>
          <input
            id="login-username-input"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <br />
        <label htmlFor="login-password-input">
          <span>password</span>
          <input
            id="login-password-input"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <br />
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
