const router = require('express').Router();
const { Op } = require('sequelize');
const { Blog , User} = require('../models');
const { sequelize } = require('../util/db');
const { blogFinder, tokenExtractor, decodedTokenExtractor, userExtractor } = require('../util/middleware');

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
    where,
    order: [
      ['likes', 'DESC']
    ]
  });
  
  return res.json(blogs);
});

// do not check that user exists? user id can also be found in the token
router.post('/', tokenExtractor, decodedTokenExtractor, userExtractor, async (req, res) => {
  const user = req.user;
  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
})

// route to like a blog
// returns only the new likes
router.put('/:id', blogFinder, async (req, res) => {
  const blog = req.blog
  blog.likes += 1;
  const savedBlog = await blog.save();
  return res.status(201).json({ likes: savedBlog.likes });
});

router.delete('/:id', blogFinder, tokenExtractor, decodedTokenExtractor, userExtractor, async (req, res) => {
  const blog = req.blog;
  const user = req.user;
  if (blog.userId === user.id) {
    await blog.destroy();
    return res.status(204).end();
  } else {
    return res.status(401).end();
  }
});

module.exports = router;