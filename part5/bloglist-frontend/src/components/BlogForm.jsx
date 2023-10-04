import { useState } from 'react'

// author is not required in backend? (success message tries to
// show author)

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    const wasAdded = await addBlog({ title, author, url })
    if (wasAdded) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div id='create-blog-form'>
      <h2>create new</h2>
      <form onSubmit={(handleSubmit)}>
        <label>
          <span>title:</span>
          <input
            id='create-blog-title-input'
            type='text'
            value={title}
            placeholder='give title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </label><br/>
        <label>
          <span>author:</span>
          <input
            id='create-blog-author-input'
            type='text'
            value={author}
            placeholder='give author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label><br/>
        <label>
          <span>url:</span>
          <input
            id='create-blog-url-input'
            type='text'
            value={url}
            placeholder='give url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </label><br/>
        <button id='create-blog-button' type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm