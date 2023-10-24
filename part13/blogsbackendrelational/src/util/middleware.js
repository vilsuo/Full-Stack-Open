const { Blog, User, Session } = require('../models');
const { SECRET } = require('../util/config');
const jwt = require('jsonwebtoken');

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).send({ error: 'blog not found' });
  }
  req.blog = blog;

  next();
};

/**
 * Adds (non-decoded) token to request.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const tokenExtractor = async (req, res, next) => {
  const authorization = req.header('Authorization');

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).send({ error: 'token required' });
  }
  req.token = authorization.substring(7);

  next();
};

/**
 * Adds decoded token to the request. Expects tokenExtractor middleware to have
 * been called.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const decodedTokenExtractor = async (req, res, next) => {
  const token = req.token;
  if (!token) {
    return res.status(401).send({ error: 'token required' });
  }

  const decodedToken = jwt.verify(token, SECRET);
  const foundValid = await Session.findOne({ where: { token, valid: true }});
  if (!decodedToken || !foundValid) {
    return res.status(401).send({ error: 'token is invalid' });
  }
  req.decodedToken = decodedToken;

  next();
}

/**
 * Adds user to the request. User is picked from the decoded token.
 * Expects decodedTokenExtractor middleware to have been called.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const userExtractor = async (req, res, next) => {
  const decodedToken = req.decodedToken;
  if (!decodedToken) {
    return res.status(400).send({ error: 'token required' });
  }
  
  const user = await User.findOne({
    where: { username: decodedToken.username }
  });

  if (!user) {
    return res.status(404).send({ error: 'user not found' });
  }
  req.user = user;

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
  tokenExtractor,
  decodedTokenExtractor,
  userExtractor,
  errorHandler
};