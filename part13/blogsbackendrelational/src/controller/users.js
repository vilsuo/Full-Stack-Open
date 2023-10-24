const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  });
  return res.json(users);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const where = {};
  if (req.query.read) {
    where.read = req.query.read;
  }

  const user = await User.findByPk(id, {
    include: [
      {
        model: Blog,
        as: 'reading',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['id', 'read'],
          where,
        },
      },
    ]
  });

  if (user) {
    return res.json({
      name: user.name,
      username: user.username,
      reading: user.reading
    });
  } else {
    return res.status(404).send({ error: 'user not found' });
  }
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
    
    return res.status(201).json(user);

  } else {
    return res.status(400).json({ error: 'password is missing' });
  }
});

// route to change username
// - param is current username, body contains new username

// TODO
// - implement with token?
router.put('/:username', async (req, res) => {
  const newUsername = req.body.username;
  const oldUsername = req.params.username;
  const user = await User.findOne({ where: { username: oldUsername } });
  if (user) {
    user.username = newUsername;
    const savedUser = await user.save();
    res.json(savedUser)
  } else {
    return res.status(404).send({ error: 'user not found' });
  }
});

module.exports = router;