const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
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
  errorHandler
};