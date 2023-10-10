import BlogForm from './BlogForm'
import BlogList from './BlogList'
import Toggable from '../Togglable'

const BlogsView = () => {
  return (
    <div>
      <h2>blogs</h2>
      <Toggable text='Create blog'>
        <BlogForm />
      </Toggable>
      <BlogList />
    </div>
  )
}

export default BlogsView
