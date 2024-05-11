import mongoose from 'mongoose';
import dotenv from 'dotenv';

//ENV configuration
dotenv.config();

export function dbConnection() {
  // eslint-disable-next-line no-undef
  let mongo_URL = process.env.MONGO_URL;
  try {
    mongoose.connect(`${mongo_URL}`);
    console.log('Database Connected Successfully');
  } catch (error) {
    console.log('Error Connecting in DB', error);
  }
}
