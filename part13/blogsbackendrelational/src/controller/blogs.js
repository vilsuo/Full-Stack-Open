const router = require('express').Router();

const { Sequelize } = require('sequelize');
const { Blog , User} = require('../models');
const { blogFinder, tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  return res.json(blogs);
});

// do not check that user exists? user id can also be found in the token
router.post('/', tokenExtractor, async (req, res) => {
  const token = req.token;

  console.log('token', token);

  const user = await User.findOne({ where: { username: token.username } });

  if (user) {
    const blog = await Blog.create({ ...req.body, userId: user.id });
    return res.json(blog);

  } else {
    throw new Sequelize.EmptyResultError('user not found');
  }
})

// returns only the new likes
router.put('/:id', blogFinder, async (req, res) => {
  const blog = req.blog
  if (blog) {
    blog.likes += 1;
    const savedBlog = await blog.save();
    return res.status(201).json({ likes: savedBlog.likes });
  } else {
    throw new Sequelize.EmptyResultError('blog not found');
  }
});

router.delete('/:id', blogFinder, async (req, res) => {
  const blog = reg.blog;
  if (blog) {
    await blog.destroy();
  }
  return res.status(204).end();
});

module.exports = router;