import { useSelector } from 'react-redux'
import BlogLink from '../links/BlogLink'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)

  return (
    <div>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogLink key={blog.id} blog={blog} />
        ))}
    </div>
  )
}
export default BlogList
