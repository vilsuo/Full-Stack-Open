import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeUser } from '../reducers/userReducer'
import { Button, Navbar, Nav, Container } from 'react-bootstrap'

const NavBar = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(removeUser())
  }

  return (
    <Navbar className='my-2 border rounded'>
      <Container>
        <Nav className='me-auto'>
          <Nav.Link href='#' as='span'>
            <Link to='/'>Home</Link>
          </Nav.Link>
          <Nav.Link href='#' as='span'>
            <Link to='/users'>Users</Link>
          </Nav.Link>
        </Nav>
      </Container>
      <Container className='flex-row-reverse'>
        <div >
          <em className='m-2'>{user.username} logged in</em>
          <Button
            id='logout-button'
            size='sm'
            onClick={handleLogout}
          >
            logout
          </Button>
        </div>
      </Container>
    </Navbar>
  )
}

export default NavBar
