import { useSelector } from 'react-redux'
import BlogLink from '../links/BlogLink'
import { Stack } from 'react-bootstrap'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)

  return (
    <Stack gap={1}>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogLink
            key={blog.id}
            blog={blog}
          />
        ))
      }
    </Stack >
  )
}
export default BlogList
