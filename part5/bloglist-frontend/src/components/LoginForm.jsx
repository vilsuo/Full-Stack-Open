import Notification from './Notification'
import { useDispatch } from 'react-redux'
import { showErrorNotification } from '../reducers/notificationReducer'
import { login } from '../reducers/userReducer'
import { useNavigate } from 'react-router-dom'
import { Form, Col, Row, Button } from 'react-bootstrap'
import { useState } from 'react'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = (event) => {
    event.preventDefault()

    dispatch(login({ username, password: password }))
      .unwrap()
      .then(() => {
        setUsername('')
        setPassword('')

        navigate('/')
      })
      .catch((error) => {
        dispatch(showErrorNotification(error))
      })
  }

  return (
    <div>
      <Notification id="login-form-notification" />
      <h2>Login to the application</h2>
      <Form
        id='create-blog-form'
        className='mb-2 p-2 border rounded'
        onSubmit={handleLogin}
      >
        <Form.Group as={Row} controlId='formLoginUsername'>
          <Form.Label column sm={2}>
            username
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              size='sm'
              type='text'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId='formLoginPassword'>
          <Form.Label column sm={2}>
            password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              size='sm'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button
              id='login-button'
              size='sm'
              type='submit'
            >
              login
            </Button >
          </Col>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm
