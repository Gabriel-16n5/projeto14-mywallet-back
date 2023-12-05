import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoCLient = new MongoClient(process.env.DATABASE_URL);
try {
  await mongoCLient.connect();
  console.log('db connection established');
} catch (error) {
  console.log('connection to db not established');
}
const db = mongoCLient.db();

export default db;
