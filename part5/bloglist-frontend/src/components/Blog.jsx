import { useState } from 'react'

// displays name of the user the blog belongs to, but
// creating users does not require to give the name

// add url as hyperlink

const Blog = ({ updateBlog, removeBlog, blog, username }) => {
  const [showAll, setShowAll] = useState(false)

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    await updateBlog(blog.id, { ...blog, 'likes': blog.likes + 1, 'user': blog.user.id })
  }

  const handleRemove = async () => {
    const message = `Remove blog ${blog.title} by ${blog.author}`
    if (window.confirm(message)) {
      await removeBlog(blog.id)
    }
  }

  const removeButton = () => {
    return username === blog.user.username
      ? <button onClick={handleRemove}>remove</button>
      : null
  }

  const toggleButton = () => (
    <button onClick={() => setShowAll(!showAll)}>
      {showAll ? 'hide' : 'view'}
    </button>
  )

  const details = () => {
    return (
      <div>
        <span>{blog.url}</span><br/>
        <span>likes {blog.likes}</span>
        <button onClick={handleLike}>like</button><br/>
        <span>{blog.user.name}</span><br/>
        { removeButton() }
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        <span>{blog.title} {blog.author}</span>
        { toggleButton() }
      </div>
      { showAll && details() }
    </div>
  )
}

export default Blog