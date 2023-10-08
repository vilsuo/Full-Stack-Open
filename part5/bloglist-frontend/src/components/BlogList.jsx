import { useDispatch, useSelector } from 'react-redux'
import Blog from './Blog'
import { deleteBlog, updateBlog } from '../reducers/blogsReducer'
import { showNotification } from '../reducers/notificationReducer'

const BlogList = ({ user }) => {
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  const handleRemove = async (blog) => {
    const message = `Remove blog ${blog.title} by ${blog.author}`
    if (window.confirm(message)) {
      dispatch(deleteBlog(blog.id))
        .unwrap()
        .then(() => {
          dispatch(showNotification(
            `blog ${blog.title} by ${blog.author} deleted`
          ))
        })
        .catch((rejectedValueError) => {
          // handle error here
          dispatch(showNotification(rejectedValueError))
        })
    }
  }

  const handleLike = async (blog) => {
    dispatch(updateBlog({
      id: blog.id,
      newValues: { ...blog, likes: blog.likes + 1, user: blog.user.id }
    }))
      .unwrap()
      .then(() => {})
      .catch((rejectedValueError) => {
        dispatch(showNotification(rejectedValueError))
      })
  }

  return (
    <div>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            likeBlog={() => handleLike(blog)}
            removeBlog={() => handleRemove(blog)}
            blog={blog}
            username={user.username}
          />
        ))}
    </div>
  )
}
export default BlogList