import { useState } from 'react'
import blogService from '../services/blogs'

// author is not required? (success message tries to show author)

const BlogForm = ({  addBlog, messageSetter }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const blog = await blogService.create({ title, author, url })
      addBlog(blog)

      setTitle('')
      setAuthor('')
      setUrl('')

      messageSetter(`a new blog ${blog.title} by ${blog.author} added`)

    } catch (exception) {
      messageSetter(exception.response.data.error)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(handleSubmit)}>
        <div>
          title:
          <input
            type='text'
            value={title}
            placeholder='give title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author}
            placeholder='give author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            placeholder='give url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm