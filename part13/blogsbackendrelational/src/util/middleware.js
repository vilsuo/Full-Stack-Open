const { Blog, User } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    req.blog = blog;
  }
  next();
};

const findByUsername = async username =>
  await User.findOne({ where: { username } });

// does not check if user is disabled
const userBodyFinder = async (req, res, next) => {
  const username = req.body.username;
  if (username) {
    req.user = await findByUsername(username);
  }
  next();
};

// does not check if user is disabled
const userParamsFinder  = async (req, res, next) => {
  const username = req.params.username;
  if (username) {
    req.user = await findByUsername(username);
  }
  next();
};

const getToken = async req => {
  const authorization = req.header('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedToken = jwt.verify(token, SECRET);
    return decodedToken;
  }
};

const userExtractor = async (req, res, next) => {
  const token = await getToken(req);
  if (token) {
    const user = await User.findOne({
      where: { username: token.username }
    });

    if (!user) {
      return res.status(404).send({ error: 'user not found' });
    } else if (user.disabled) {
      return res.status(401).send({ error: 'user is disabled' });
    } else {
      req.user = user;
    }
  } else {
    return res.status(400).send({ error: 'token required' });
  }
  next();
}

const errorHandler = async (error, req, res, next) => {
  switch (error.name) {
    case 'SequelizeValidationError':
      return res.status(400).send({
        error: error.errors.map(error => error.message).join('. ')
      });
    case 'JsonWebTokenError':
      return res.status(401).json({ error: error.message })
  }
  next(error);
}

module.exports = {
  blogFinder,
  userBodyFinder,
  userParamsFinder,
  userExtractor,
  errorHandler
};