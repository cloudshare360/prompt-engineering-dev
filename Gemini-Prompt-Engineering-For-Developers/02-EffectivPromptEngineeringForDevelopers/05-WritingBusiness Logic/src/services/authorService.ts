import { ObjectId, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';
import { getDB } from '../db';
import { IAuthor } from '../models/Author';

const COLLECTION_NAME = 'authors';

/**
 * Adds a new author to the database.
 * @param {Omit<IAuthor, '_id' | 'books' | 'createdAt' | 'updatedAt'>} authorData - The author data to create.
 * @returns {Promise<InsertOneResult<IAuthor>>} The result of the insert operation.
 */
export async function createAuthor(
  authorData: Omit<IAuthor, '_id' | 'books' | 'createdAt' | 'updatedAt'>
): Promise<InsertOneResult<IAuthor>> {
  try {
    const db = getDB();
    const authorsCollection = db.collection<IAuthor>(COLLECTION_NAME);
    const now = new Date();
    const result = await authorsCollection.insertOne({
      ...authorData,
      books: [], // Initialize with an empty array of books
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Author created with _id: ${result.insertedId}`);
    return result;
  } catch (error) {
    console.error('Error creating author:', error);
    throw error;
  }
}

/**
 * Retrieves an author by their ID.
 * @param {string} id - The ID of the author to retrieve.
 * @returns {Promise<IAuthor | null>} The author document, or null if not found.
 */
export async function getAuthorById(id: string): Promise<IAuthor | null> {
  try {
    const db = getDB();
    const authorsCollection = db.collection<IAuthor>(COLLECTION_NAME);
    const objectId = new ObjectId(id);
    const author = await authorsCollection.findOne({ _id: objectId });
    return author;
  } catch (error) {
    console.error(`Error getting author by ID ${id}:`, error);
    throw error;
  }
}

/**
 * Retrieves an author by their name.
 * @param {string} name - The name of the author to retrieve.
 * @returns {Promise<IAuthor | null>} The author document, or null if not found.
 */
export async function getAuthorByName(name: string): Promise<IAuthor | null> {
  try {
    const db = getDB();
    const authorsCollection = db.collection<IAuthor>(COLLECTION_NAME);
    const author = await authorsCollection.findOne({ name: name });
    return author;
  } catch (error) {
    console.error(`Error getting author by name ${name}:`, error);
    throw error;
  }
}

/**
 * Retrieves all authors from the database.
 * @returns {Promise<IAuthor[]>} An array of author documents.
 */
export async function getAllAuthors(): Promise<IAuthor[]> {
  try {
    const db = getDB();
    const authorsCollection = db.collection<IAuthor>(COLLECTION_NAME);
    const authors = await authorsCollection.find({}).toArray();
    return authors;
  } catch (error) {
    console.error('Error getting all authors:', error);
    throw error;
  }
}

/**
 * Updates an existing author by their ID.
 * @param {string} id - The ID of the author to update.
 * @param {Partial<Omit<IAuthor, '_id' | 'books' | 'createdAt' | 'updatedAt'>>} updates - The fields to update.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
export async function updateAuthor(
  id: string,
  updates: Partial<Omit<IAuthor, '_id' | 'books' | 'createdAt' | 'updatedAt'>>
): Promise<UpdateResult> {
  try {
    const db = getDB();
    const authorsCollection = db.collection<IAuthor>(COLLECTION_NAME);
    const objectId = new ObjectId(id);
    const result = await authorsCollection.updateOne(
      { _id: objectId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    console.log(`Author with _id: ${id} updated.`);
    return result;
  } catch (error) {
    console.error(`Error updating author with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes an author by their ID.
 * IMPORTANT: This operation does not automatically handle deleting related books
 * or updating book documents that reference this author. This will need to be handled
 * at the application level to maintain data consistency.
 * @param {string} id - The ID of the author to delete.
 * @returns {Promise<DeleteResult>} The result of the delete operation.
 */
export async function deleteAuthor(id: string): Promise<DeleteResult> {
  try {
    const db = getDB();
    const authorsCollection = db.collection<IAuthor>(COLLECTION_NAME);
    const objectId = new ObjectId(id);
    const result = await authorsCollection.deleteOne({ _id: objectId });
    console.log(`Author with _id: ${id} deleted.`);
    return result;
  } catch (error) {
    console.error(`Error deleting author with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Adds a book reference to an author's books array.
 * This is called internally when a book is created and linked to an author.
 * @param {ObjectId} authorId - The ID of the author.
 * @param {ObjectId} bookId - The ID of the book to add.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
export async function addBookToAuthor(
  authorId: ObjectId,
  bookId: ObjectId
): Promise<UpdateResult> {
  try {
    const db = getDB();
    const authorsCollection = db.collection<IAuthor>(COLLECTION_NAME);
    const result = await authorsCollection.updateOne(
      { _id: authorId },
      { $addToSet: { books: bookId }, $set: { updatedAt: new Date() } }
    );
    return result;
  } catch (error) {
    console.error(`Error adding book ${bookId} to author ${authorId}:`, error);
    throw error;
  }
}

/**
 * Removes a book reference from an author's books array.
 * This is called internally when a book is deleted.
 * @param {ObjectId} authorId - The ID of the author.
 * @param {ObjectId} bookId - The ID of the book to remove.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
export async function removeBookFromAuthor(
  authorId: ObjectId,
  bookId: ObjectId
): Promise<UpdateResult> {
  try {
    const db = getDB();
    const authorsCollection = db.collection<IAuthor>(COLLECTION_NAME);
    const result = await authorsCollection.updateOne(
      { _id: authorId },
      { $pull: { books: bookId }, $set: { updatedAt: new Date() } }
    );
    return result;
  } catch (error) {
    console.error(`Error removing book ${bookId} from author ${authorId}:`, error);
    throw error;
  }
}
