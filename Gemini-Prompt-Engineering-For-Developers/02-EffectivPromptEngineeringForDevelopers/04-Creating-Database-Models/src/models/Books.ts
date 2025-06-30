import { ObjectId } from 'mongodb';

/**
 * Interface representing a Book document in MongoDB.
 */
export interface IBook {
  _id?: ObjectId; // MongoDB's default primary key
  title: string;
  author: {
    id: ObjectId; // Reference to the Author's _id
    name: string; // Embedded author name for quick access
  };
  genre: string;
  publicationYear: number;
  isbn?: string; // Optional ISBN, unique
  createdAt?: Date;
  updatedAt?: Date;
}
