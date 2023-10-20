const { Blog, User } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const findByUsername = async username =>
  await User.findOne({ where: { username } });

/**
 * Middleware for picking up the user from the request body username.
 * Inserts the User to the request param user
 * 
 * @param {*} req http request
 * @param {*} res http response
 * @param {*} next 
 */
const userBodyFinder = async (req, res, next) => {
  const username = req.body.username;
  if (username) {
    req.user = await findByUsername(username);
  }
  next();
};

const userParamsFinder  = async (req, res, next) => {
  const username = req.params.username;
  if (username) {
    req.user = await findByUsername(username);
  }
  next();
};

const errorHandler = async (error, req, res, next) => {
  switch (error.name) {
    case 'SequelizeValidationError':
      return res.status(400).send({
        error: error.errors.map(error => error.message).join('. ')
      });
    case 'SequelizeEmptyResultError':
      return res.status(404).send({ error: error.message });
    case 'JsonWebTokenError':
      return res.status(401).json({ error: error.message })
  }
  next(error);
}

module.exports = {
  blogFinder,
  userBodyFinder,
  userParamsFinder,
  errorHandler
};