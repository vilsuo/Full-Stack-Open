import { useDispatch, useSelector } from 'react-redux'
import Blog from './Blog'
import { deleteBlog } from '../reducers/blogsReducer'

const BlogList = ({ user }) => {
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  return (
    <div>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            /*updateBlog={updateBlog}*/
            removeBlog={() => dispatch(deleteBlog(blog.id))}
            blog={blog}
            username={user.username}
          />
        ))}
    </div>
  )
}
export default BlogList