import Togglable from '../Togglable'
import BlogForm from './BlogForm'
import BlogList from './BlogList'

const BlogsView = () => {
  return (
    <div>
      <h2>blogs</h2>
      <Togglable buttonLabel="create new blog">
        <BlogForm />
      </Togglable>
      <BlogList />
    </div>
  )
}

export default BlogsView
