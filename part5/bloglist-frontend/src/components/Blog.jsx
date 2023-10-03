import { useState } from "react"
import blogService from '../services/blogs'

// displays name of the user the blog belongs to, but
// creating users does not require to give the name

// add url as hyperlink

const Blog = ({ blogData }) => {
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

  const text = showAll ? 'hide' : 'view'

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>{text}</button><br/>
      { showAll && <>
        {blog.url}<br/>
        likes {blog.likes}
        <button onClick={handleLike}>like</button><br/>
        {blog.user.name}
      </>}
    </div>  
  )
}

export default Blog