const router = require('express').Router();
const { blogFinder, tokenExtractor } = require('../util/middleware');
const { User, ReadingList } = require('../models');
const { Sequelize } = require('sequelize');

router.post('/', async (req, res) => {
  const reading = await ReadingList.create(req.body);

  res.status(201).send({ reading });
});

router.put('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const blog = req.blog;
  if (!blog) {
    throw new Sequelize.EmptyResultError('blog not found');
  }

  const token = req.token;
  const user = await User.findOne({
    where: { username: token.username }
  });

  if (user) {
    const readingListEntry = await ReadingList.findOne({
      where: {
        userId: user.id,
        blogId: blog.id
      }
    });

    if (readingListEntry) {
      readingListEntry.read = req.body.read;
      const updatedReadingListEntry = await readingListEntry.save();
      return res.json(updatedReadingListEntry);
    } else {
      return res.status(401).send({
        error: 'blog not found in reading list'
      });
    }
  } else {
    throw new Sequelize.EmptyResultError('user not found');
  }
})

module.exports = router;