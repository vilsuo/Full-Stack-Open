const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');

const blogsRouter = require('./controller/blogs');
const usersRouter = require('./controller/users');
const loginRouter = require('./controller/login');
const logoutRouter = require('./controller/logout');
const authorsRouter = require('./controller/authors');
const readingListsRouter = require('./controller/readinglists');

const { connectToDatabase } = require('./util/db');
const { errorHandler } = require('./util/middleware');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/readinglists', readingListsRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port=${PORT}`);
  });
};

start();
