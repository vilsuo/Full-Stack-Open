const _ = require("lodash");

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  let mostLikes = 0
  let mostLikedBlog
  for (const blog of blogs) {
    if (blog.likes >= mostLikes) {
      mostLikedBlog = blog
      mostLikes = blog.likes
    }
  }

  return mostLikedBlog
}

const mostBlogs = (blogs) => {
  const blogCounts = Object.entries(_.countBy(blogs, 'author'))
  const temp = _.maxBy(blogCounts, x => x[1])

  return {
    'author': temp[0],
    'blogs': temp[1]
  }
}

const mostLikes = (blogs) => {
  const likesObject = {}
  for (const blog of blogs) {
    const author = blog.author
    if (!(author in likesObject)) {
      likesObject[author] = 0
    }
    likesObject[author] = likesObject[author] + blog.likes
  }

  let mostLikes = 0
  let mostLikedAuthor
  for (const [author, likes] of Object.entries(likesObject)) {
    if (likes >= mostLikes) {
      mostLikes = likes
      mostLikedAuthor = author
    }
  }

  return { 'author': mostLikedAuthor, 'likes': mostLikes}
}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}