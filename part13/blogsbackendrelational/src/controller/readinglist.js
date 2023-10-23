const router = require('express').Router();
const { ReadingList } = require('../models');

router.post('/', async (req, res) => {

  const reading = await ReadingList.create(req.body);

  res.status(201).send({ reading });
});

module.exports = router;