import { useState } from 'react'
import Notification from './Notification'
import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { login } from '../reducers/userReducer'
import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const usernameField = useField('text', 'login-username-input')
  const passwordField = useField('password', 'login-password-input')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = (event) => {
    event.preventDefault()

    dispatch(login({ username: usernameField.inputProps.value, password: passwordField.inputProps.value }))
      .unwrap()
      .then(() => {
        usernameField.reset()
        passwordField.reset()

        navigate('/')
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
          <input { ...usernameField.inputProps } />
        </label>
        <br />
        <label htmlFor="login-password-input">
          <span>password</span>
          <input { ...passwordField.inputProps } />
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
