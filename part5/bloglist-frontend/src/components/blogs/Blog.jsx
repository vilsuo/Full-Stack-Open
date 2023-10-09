import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteBlog, updateBlog } from '../../reducers/blogsReducer'
import { showSuccessNotification, showErrorNotification } from '../../reducers/notificationReducer'
import { removeUserBlog, updateUserBlog } from '../../reducers/usersReducer'
import Comments from '../comments/Comments'

// displays name of the user the blog belongs to, but
// creating users does not require to give the name

const Blog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)

  const id = useParams().id
  const blog = blogs.find((blog) => blog.id === id)

  if (!blog) {
    return null
  }

  const handleRemove = async () => {
    const message = `Remove blog ${blog.title} by ${blog.author}`
    if (window.confirm(message)) {
      dispatch(deleteBlog(blog.id))
        .unwrap()
        .then((id) => {
          dispatch(removeUserBlog(id))

          dispatch(
            showSuccessNotification(`blog ${blog.title} by ${blog.author} deleted`),
          )
          navigate(-1)
        })
        .catch((rejectedValueError) => {
          dispatch(showErrorNotification(rejectedValueError))
        })
    }
  }

  const handleLike = async () => {
    dispatch(
      updateBlog({
        id: blog.id,
        newValues: { ...blog, likes: blog.likes + 1, user: blog.user.id },
      }),
    )
      .unwrap()
      .then((updatedBlog) => {
        dispatch(updateUserBlog(updatedBlog))
        dispatch(
          showSuccessNotification(`liked a blog ${blog.title} by ${blog.author}`),
        )
      })
      .catch((rejectedValueError) => {
        dispatch(showErrorNotification(rejectedValueError))
      })
  }

  const removeButton = () => {
    return user.username === blog.user.username ? (
      <button id="remove-blog-button" onClick={handleRemove}>
        remove
      </button>
    ) : null
  }

  const likeButton = () => (
    <button id="like-blog-button" onClick={handleLike}>
      like
    </button>
  )

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a><br />
        <span id="blog-likes">{blog.likes} likes</span>
        {likeButton()}<br />
        <span>added by {blog.user.name}</span><br />
        {removeButton()}
      </div>
      <Comments blog={blog} />
    </div>
  )
}

export default Blog
