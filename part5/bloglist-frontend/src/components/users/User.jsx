import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BlogLink from '../links/BlogLink'

const User = () => {
  const id = useParams().id
  const users = useSelector((state) => state.users)
  const user = users.find((user) => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <div>
        {user.blogs.map((blog) => (
          <BlogLink key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default User
