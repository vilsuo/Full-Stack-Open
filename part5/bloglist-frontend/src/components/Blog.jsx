import { useState } from 'react'

// displays name of the user the blog belongs to, but
// creating users does not require to give the name

// add url as hyperlink

const Blog = ({ likeBlog, removeBlog, blog, username }) => {
  const [showAll, setShowAll] = useState(false)

  const removeButton = () => {
    return username === blog.user.username ? (
      <button id="remove-blog-button" onClick={removeBlog}>
        remove
      </button>
    ) : null
  }

  const toggleButton = () => (
    <button id="blog-view-button" onClick={() => setShowAll(!showAll)}>
      {showAll ? 'hide' : 'view'}
    </button>
  )

  const details = () => {
    return (
      <div>
        <span>{blog.url}</span>
        <br />
        <span id="blog-likes">likes {blog.likes}</span>
        <button id="like-blog-button" onClick={likeBlog}>
          like
        </button>
        <br />
        <span>{blog.user.name}</span>
        <br />
        {removeButton()}
      </div>
    )
  }

  return (
    <div className="blog">
      <span>
        {blog.title} {blog.author}
      </span>
      {toggleButton()}
      {showAll && details()}
    </div>
  )
}

export default Blog
