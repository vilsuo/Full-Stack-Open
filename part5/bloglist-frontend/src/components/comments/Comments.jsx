import { useDispatch } from 'react-redux'
import { useField } from '../../hooks'
import { createComment } from '../../reducers/blogsReducer'
import { showSuccessNotification, showErrorNotification } from '../../reducers/notificationReducer'
import { updateUserBlog } from '../../reducers/usersReducer'

const CommentForm = ({ blogId }) => {
  const commentField = useField(
    'text', 'form-comment-input', 'write your comment here'
  )
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()

    const comment = commentField.inputProps.value
    dispatch(createComment({ id: blogId, comment }))
      .unwrap()
      .then(updatedBlog => {
        dispatch(updateUserBlog(updatedBlog))
        dispatch(showSuccessNotification(`comment ${comment} added`))
        commentField.reset()
      })
      .catch(rejectedValueError => {
        dispatch(showErrorNotification(rejectedValueError))
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input { ...commentField.inputProps }/>
      <button type='submit'>add comment</button>
    </form>
  )
}

const CommentList = ({ comments }) => {
  return (
    <div>
      <ul>
        {comments.map((comment, index) =>
          <li key={index}>{comment}</li>
        )}
      </ul>
    </div>
  )
}

const Comments = ({ blog }) => {
  return (
    <div>
      <h3>comments</h3>
      <CommentForm blogId={blog.id} />
      <CommentList comments={blog.comments} />
    </div>
  )
}

export default Comments