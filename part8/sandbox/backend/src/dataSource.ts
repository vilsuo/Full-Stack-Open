import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file 

mongoose.set('strictQuery', false);

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const MONGODB_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:27017`;

export const connectToDatabase = async () => {
  try {
    // console.log('MONGODB_URI', MONGODB_URI)
    await mongoose.connect(MONGODB_URI);
    console.log('connected to MongoDB');

  } catch (error) {
    console.log('error connection to MongoDB:', error.message);
  }
};
