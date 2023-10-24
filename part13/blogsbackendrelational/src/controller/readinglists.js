const router = require('express').Router();
const { blogFinder, tokenExtractor, decodedTokenExtractor, userExtractor } = require('../util/middleware');
const { ReadingList } = require('../models');

// add UserExtractor?
router.post('/', async (req, res) => {
  const reading = await ReadingList.create(req.body);

  return res.status(201).send({ reading });
});

router.put('/:id', blogFinder, tokenExtractor, decodedTokenExtractor, userExtractor, async (req, res) => {
  const blog = req.blog;
  const user = req.user;
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
    return res.status(404).send({
      error: 'blog not found in reading list'
    });
  }
})

module.exports = router;