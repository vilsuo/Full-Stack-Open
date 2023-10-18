require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

/*
const express = require('express')

const app = express()
app.use(express.json())
*/

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  const blogs = await sequelize.query(
    'SELECT * FROM blogs',
    { type: QueryTypes.SELECT }
  )

  blogs.forEach(blog => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
  })
}

main();
/*
app.get('/api/blogs', async (req, res) => {
  const blogs = await sequelize.query(
    'SELECT * FROM blogs',
    { type: QueryTypes.SELECT }
  )

  res.json(blogs)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port=${PORT}`)
})
*/