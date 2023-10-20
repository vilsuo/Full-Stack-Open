const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { userBodyFinder } = require('../util/middleware');

router.post('/', userBodyFinder, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({ error: 'missing username or password'});
  }

  const user = req.user;
  if (user) {
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (passwordCorrect) {
      const userForToken = {
        username: user.username,
        id: user.id,
      };
    
      const token = jwt.sign(userForToken, SECRET);
      return res.send({ token, username: user.username, name: user.name });
    }
  }

  res.status(401).send({ error: 'invalid username or password' });
});

module.exports = router;