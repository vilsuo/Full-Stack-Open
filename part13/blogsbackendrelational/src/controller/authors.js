const router = require('express').Router();
const { sequelize } = require('../util/db');
const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const groups = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    order: [
      ['likes', 'DESC']
    ],
    group: [['author']]
  });

  return res.json(groups);
});

module.exports = router;