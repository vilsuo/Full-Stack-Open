const router = require('express').Router();

const { Sequelize, Op } = require('sequelize');
const { Blog , User} = require('../models');
const { sequelize } = require('../util/db');
const { blogFinder, tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  let where = {};

  // case insensitive title substring search
  if (req.query.search) {
    where = {
      [Op.or]: [
        sequelize.where(
          sequelize.fn('lower', sequelize.col('title')),
          { [Op.substring] : req.query.search.toLowerCase() }
        ),
        sequelize.where(
          sequelize.fn('lower', sequelize.col('author')),
          { [Op.substring] : req.query.search.toLowerCase() }
        )
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['id', 'name', 'username']
    },
    where
  });
  return res.json(blogs);
});

// do not check that user exists? user id can also be found in the token
router.post('/', tokenExtractor, async (req, res) => {
  const token = req.token;
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

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const blog = req.blog;
  const token = req.token;

  if (blog && blog.userId === token.id) {
    await blog.destroy();
    return res.status(204).end();
  } else {
    return res.status(401).end();
  }
});

module.exports = router;