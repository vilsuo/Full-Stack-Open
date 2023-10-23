const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readinglist');

// These calls will cause Sequelize to automatically add foreign keys to the
// appropriate models (unless they are already present)

// one-to-many
// foreign key in Blog
User.hasMany(Blog);

// one-to-one
// foreign key in Blog
Blog.belongsTo(User);

// many-to-many
// use ReagingList as junction table
User.belongsToMany(Blog, { through: ReadingList, as: 'reading' });

Blog.belongsToMany(User, { through: ReadingList, as: 'users_reading' });

module.exports = {
  Blog,
  User,
};