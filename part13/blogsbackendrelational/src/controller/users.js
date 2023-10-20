const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, Blog } = require('../models');
const { Sequelize } = require('sequelize');
const { userParamsFinder } = require('../util/middleware');

// TODO
// - do not return passwordHash
router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  });
  res.json(users);
});

const encodePassword = async plainTextPassword => {
  const saltRounds = 10;
  return await bcrypt.hash(plainTextPassword, saltRounds);
}

router.post('/', async (req, res) => {
  const body = req.body;
  if (body.password) {
    const encodedPassword = await encodePassword(body.password);

    const user = await User.create({
      ...body,
      passwordHash: encodedPassword
    });
      
    res.status(201).json(user);
  } else {
    res.status(400).json({ error: 'password is missing' });
  }
});

// changes username
router.put('/:username', userParamsFinder, async (req, res) => {
  const newUsername = req.body.username;
  const user = req.user;
  if (user) {
    user.username = newUsername;
    const savedUser = await user.save();
    res.json(savedUser)
  } else {
    throw new Sequelize.EmptyResultError('user not found');
  }
});

module.exports = router;