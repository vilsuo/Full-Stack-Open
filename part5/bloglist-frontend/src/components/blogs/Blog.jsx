import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteBlog, updateBlog } from '../../reducers/blogsReducer'
import { showSuccessNotification, showErrorNotification } from '../../reducers/notificationReducer'
import { removeUserBlog, updateUserBlog } from '../../reducers/usersReducer'
import Comments from '../comments/Comments'
import { useState } from 'react'
import { Button, Modal, Stack } from 'react-bootstrap'
// displays name of the user the blog belongs to, but
// creating users does not require to give the name

const Blog = () => {
  const [show, setShow] = useState(false)
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
    dispatch(deleteBlog(blog.id))
      .unwrap()
      .then((id) => {
        dispatch(removeUserBlog(id))

        dispatch(
          showSuccessNotification(
            `blog ${blog.title} by ${blog.author} deleted`
          )
        )

        navigate(-1)
      })
      .catch((rejectedValueError) => {
        dispatch(showErrorNotification(rejectedValueError))
      })
    setShow(false)
  }

  const handleLike = async () => {
    dispatch(
      updateBlog({
        id: blog.id,
        newValues: {
          ...blog,
          likes: blog.likes + 1,
          user: blog.user.id
        }
      })
    )
      .unwrap()
      .then((updatedBlog) => {
        dispatch(updateUserBlog(updatedBlog))

        dispatch(
          showSuccessNotification(
            `liked a blog ${blog.title} by ${blog.author}`
          )
        )
      })
      .catch(error => {
        dispatch(showErrorNotification(error))
      })
  }

  const handleClose = () => setShow(false)

  const likeButton = () => (
    <Button
      id='like-blog-button'
      size='sm'
      onClick={handleLike}
    >
      like
    </Button>
  )

  const removeButton = () => {
    if (user.username !== blog.user.username) {
      return null
    }

    return (
      <Button
        id='remove-blog-button'
        size='sm'
        onClick={() => setShow(true)}
      >
        remove
      </Button>
    )
  }

  return (
    <div>
      <RemoveConfirmModal
        blog={blog}
        show={show}
        handleClose={handleClose}
        handleRemove={handleRemove}
      />
      <Stack
        className='my-2 p-2 border rounded'
      >
        <h2>{blog.title} {blog.author}</h2>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div id='blog-likes'>{blog.likes} likes</div>
        <div>added by {blog.user.name}</div>
        <Stack
          direction='horizontal'
          className='mt-2'
          gap={2}
        >
          {likeButton()}
          {removeButton()}
        </Stack>
      </Stack>
      <Comments blog={blog} />
    </div>
  )
}

const RemoveConfirmModal = ({ show, blog, handleClose, handleRemove }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {`Remove ${blog.title} by ${blog.author}?`}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant='primary'
          onClick={handleRemove}
        >
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Blog
