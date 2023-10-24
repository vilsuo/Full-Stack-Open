const router = require('express').Router();
const { tokenExtractor } = require('../util/middleware');
const { Session } = require('../models');

router.delete('/', tokenExtractor, async (req, res) => {
  const token = req.token;
  await Session.destroy({ where: { token } });

  // 205 = 'no content, refresh'
  return res.status(205).end();
});

module.exports = router;