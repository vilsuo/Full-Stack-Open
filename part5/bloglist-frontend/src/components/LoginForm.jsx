import { useState } from 'react'
import Notification from './Notification'
import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { login } from '../reducers/userReducer'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        setUsername('')
        setPassword('')
      })
      .catch((error) => {
        dispatch(showNotification(error))
      })
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
