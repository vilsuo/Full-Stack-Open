require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')

const express = require('express')

const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const body = req.body;
    const newBlog = await Blog.create(body)

    res.send(newBlog)
  } catch (error) {
    res.status(400).end()
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  const id = req.params.id
  await Blog.destroy({ where: { id }})
  /*
  const blogToDelete = await Blog.findByPk(id)
  if (blogToDelete) {
    await blogToDelete.destroy();
  }
  */
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port=${PORT}`)
})