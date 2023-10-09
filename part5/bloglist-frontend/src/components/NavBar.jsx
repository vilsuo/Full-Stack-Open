import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeUser } from '../reducers/userReducer'

const style = {
  padding: 5,
}

const NavBar = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(removeUser())
  }

  return (
    <div>
      <Link style={style} to="/">
        blogs
      </Link>
      <Link style={style} to="/users">
        users
      </Link>
      <em>{user.name} logged in</em>
      <button id="logout-button" onClick={handleLogout}>
        logout
      </button>
    </div>
  )
}

export default NavBar
