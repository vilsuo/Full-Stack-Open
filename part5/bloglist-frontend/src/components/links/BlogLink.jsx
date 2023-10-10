import { Link } from 'react-router-dom'

const BlogLink = ({ blog }) => {
  return (
    <div className='mt-2 px-2 border rounded'>
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
    </div>
  )
}

export default BlogLink
