const router = require('express').Router();

const { Sequelize } = require('sequelize');
const { Blog } = require('../models');
const { blogFinder } = require('../util/middleware');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
  res.json(blog);
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes += 1;
    const savedBlog = await req.blog.save();
    res.status(201).json({ likes: savedBlog.likes });
  } else {
    throw new Sequelize.EmptyResultError('blog not found');
  }
});

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

module.exports = router