import { ObjectId } from 'mongodb';

/**
 * Interface representing an Author document in MongoDB.
 */
export interface IAuthor {
  _id?: ObjectId; // MongoDB's default primary key
  name: string;
  biography?: string;
  dateOfBirth?: Date;
  books?: ObjectId[]; // Array of ObjectIds referencing books by this author
  createdAt?: Date;
  updatedAt?: Date;
}
