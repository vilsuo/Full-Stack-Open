import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UsersTable = ({ users }) => {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Users = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <UsersTable users={users} />
    </div>
  )
}

export default Users
