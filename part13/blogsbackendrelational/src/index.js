const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const blogsRouter = require('./controller/blogs');
const { connectToDatabase } = require('./util/db');

app.use(express.json());

app.use('/api/blogs', blogsRouter);

const start = async () => {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port=${PORT}`);
  });
};

start();
