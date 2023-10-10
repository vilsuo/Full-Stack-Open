import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { createComment } from '../../reducers/blogsReducer'
import { showSuccessNotification, showErrorNotification } from '../../reducers/notificationReducer'
import { updateUserBlog } from '../../reducers/usersReducer'
import { Form, FloatingLabel, Button, Stack } from 'react-bootstrap'

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()

    dispatch(createComment({ id: blogId, comment }))
      .unwrap()
      .then(updatedBlog => {
        dispatch(updateUserBlog(updatedBlog))
        dispatch(showSuccessNotification(`comment ${comment} added`))
        setComment('')
      })
      .catch(rejectedValueError => {
        dispatch(showErrorNotification(rejectedValueError))
      })
  }

  return (
    <Form
      className='border rounded mt-2 p-2'
      onSubmit={handleSubmit}
    >
      <FloatingLabel
        controlId='formComment'
        label='comment'
      >
        <Form.Control
          size='sm'
          as='textarea'
          value={comment}
          placeholder='leave a comment'
          style={{ height: '100px' }}
          onChange={(event) => setComment(event.target.value)}
        />
      </FloatingLabel>
      <Button
        size='sm'
        className='mt-2'
        type='submit'
      >
        post
      </Button>
    </Form>
  )
}

const CommentList = ({ comments }) => {
  return (
    <Stack gap={1}>
      {comments.map((comment, index) =>
        <div
          key={index}
          className='mt-2 px-2 border rounded'
        >
          {comment}
        </div>
      )}
    </Stack >
  )
}

const Comments = ({ blog }) => {
  return (
    <div className='p-2 border rounded'>
      <h3>comments</h3>
      <CommentList comments={blog.comments} />
      <CommentForm blogId={blog.id} />
    </div>
  )
}

export default Comments