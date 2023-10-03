import { useState } from "react"
import blogService from '../services/blogs'

// displays name of the user the blog belongs to, but
// creating users does not require to give the name

// add url as hyperlink

const Blog = ({ removeBlog, blogData, username }) => {
  const [blog, setBlog] = useState(blogData)
  const [showAll, setShowAll] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowAll(!showAll)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.update(
        blog.id, { 'likes': blog.likes + 1 }
      )
      setBlog(updatedBlog)
    } catch (exception) {
      console.log('error', exception)
    }
  }

  const handleRemove = async () => {
    try {
      const message = `Remove blog ${blog.title} by ${blog.author}`
      if (window.confirm(message)) {
        await blogService.remove(blog.id)
        console.log('removed')

        // remove from all blogs
        removeBlog(blog)
      }
    } catch (exception) {
      console.log('error', exception)
    }
  }

  const text = showAll ? 'hide' : 'view'

  const removeButton = () => {
    if (username !== blog.user.username) {
      return null
    } else {
      return <button onClick={handleRemove}>remove</button>
    }
  }

  const info = () => {
    if (!showAll) {
      return null
    } else {
      return (
        <div>
          {blog.url}<br/>
          likes {blog.likes}
          <button onClick={handleLike}>like</button><br/>
          {blog.user.name}<br/>
          {removeButton()}
        </div>
      )
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{text}</button><br/>
      </div>
      { showAll && info() }
    </div>  
  )
}

export default Blog