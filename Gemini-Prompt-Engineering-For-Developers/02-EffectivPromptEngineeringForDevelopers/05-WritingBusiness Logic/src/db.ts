import { MongoClient, Db, ObjectId } from 'mongodb';

// Replace with your MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017';
// Replace with your database name
const DB_NAME = 'libraryDB';

let db: Db;
let client: MongoClient;

/**
 * Connects to MongoDB and initializes the database and client instances.
 * @returns {Promise<Db>} The MongoDB database instance.
 */
export async function connectDB(): Promise<Db> {
  if (db) {
    return db; // Return existing connection if already established
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Successfully connected to MongoDB: ${DB_NAME}`);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit process if database connection fails
  }
}

/**
 * Closes the MongoDB connection.
 */
export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

/**
 * Returns the initialized MongoDB database instance.
 * Throws an error if the database is not connected.
 * @returns {Db} The MongoDB database instance.
 */
export function getDB(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

// Optional: Graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});
