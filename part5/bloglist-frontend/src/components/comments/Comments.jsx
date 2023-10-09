import { useField } from '../../hooks'

const CommentForm = () => {
  const commentField = useField(
    'text', 'form-comment-input', 'write your comment here'
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    console.log('added comment', commentField.inputProps.value)
    commentField.reset()
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

const Comments = ({ comments, handleSubmit }) => {
  return (
    <div>
      <h3>comments</h3>
      <CommentForm />
      <CommentList comments={comments} />
    </div>
  )
}

export default Comments