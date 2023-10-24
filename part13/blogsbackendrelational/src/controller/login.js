const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'missing username or password'});
  }

  const user = await User.findOne({ where: { username } });
  if (user) {
    if (user.disabled) {
      return res.status(401).send({ error: 'user is disabled' });
    }
    
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (passwordCorrect) {
      const userForToken = {
        username: user.username,
        id: user.id,
      };
    
      const token = jwt.sign(userForToken, SECRET);

      await Session.create({ token });

      return res.send({ token, username: user.username, name: user.name });
    }
  }

  return res.status(401).send({ error: 'invalid username or password' });
});

module.exports = router;