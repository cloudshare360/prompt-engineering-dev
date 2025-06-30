import { connectDB, closeDB } from './db';
import { createAuthor, getAuthorById, getAllAuthors, updateAuthor, deleteAuthor } from './services/authorService';
import { createBook, getBookById, getBooksByGenre, getBooksByPublicationYear, getAllBooks, updateBook, deleteBook } from './services/bookService';
import { ObjectId } from 'mongodb';

async function run() {
  try {
    await connectDB();

    console.log('\n--- Creating Authors ---');
    const author1Result = await createAuthor({
      name: 'Jane Austen',
      biography: 'English novelist.',
      dateOfBirth: new Date('1775-12-16'),
    });
    const author1Id = author1Result.insertedId;
    console.log(`Created Author Jane Austen with ID: ${author1Id}`);

    const author2Result = await createAuthor({
      name: 'George Orwell',
      biography: 'English novelist, essayist, journalist, and critic.',
      dateOfBirth: new Date('1903-06-25'),
    });
    const author2Id = author2Result.insertedId;
    console.log(`Created Author George Orwell with ID: ${author2Id}`);

    console.log('\n--- Getting all Authors ---');
    let allAuthors = await getAllAuthors();
    console.log(allAuthors.map(a => ({ id: a._id, name: a.name, booksCount: a.books?.length })));

    console.log('\n--- Creating Books ---');
    if (author1Id) {
      const book1Result = await createBook({
        title: 'Pride and Prejudice',
        author: { id: author1Id, name: 'Jane Austen' }, // name is embedded for quick access
        genre: 'Romance',
        publicationYear: 1813,
        isbn: '978-0141439518',
      });
      const book1Id = book1Result.insertedId;
      console.log(`Created Book 'Pride and Prejudice' with ID: ${book1Id}`);

      const book2Result = await createBook({
        title: 'Sense and Sensibility',
        author: { id: author1Id, name: 'Jane Austen' },
        genre: 'Romance',
        publicationYear: 1811,
        isbn: '978-0141439519',
      });
      const book2Id = book2Result.insertedId;
      console.log(`Created Book 'Sense and Sensibility' with ID: ${book2Id}`);
    }

    if (author2Id) {
      const book3Result = await createBook({
        title: '1984',
        author: { id: author2Id, name: 'George Orwell' },
        genre: 'Dystopian',
        publicationYear: 1949,
        isbn: '978-0451524935',
      });
      const book3Id = book3Result.insertedId;
      console.log(`Created Book '1984' with ID: ${book3Id}`);
    }

    console.log('\n--- Getting all Books ---');
    let allBooks = await getAllBooks();
    console.log(allBooks.map(b => ({ title: b.title, author: b.author.name, genre: b.genre, year: b.publicationYear })));

    console.log('\n--- Getting Books by Genre (Romance) ---');
    const romanceBooks = await getBooksByGenre('Romance');
    console.log(romanceBooks.map(b => b.title));

    console.log('\n--- Getting Books by Publication Year (1949) ---');
    const books1949 = await getBooksByPublicationYear(1949);
    console.log(books1949.map(b => b.title));

    console.log('\n--- Updating an Author ---');
    if (author1Id) {
      await updateAuthor(author1Id.toHexString(), { biography: 'Celebrated English novelist of the Regency era.' });
      const updatedAuthor = await getAuthorById(author1Id.toHexString());
      console.log('Updated Jane Austen biography:', updatedAuthor?.biography);
    }

    console.log('\n--- Updating a Book (e.g., changing genre of Pride and Prejudice) ---');
    const prideAndPrejudice = await getBooksByGenre('Romance').then(books => books.find(b => b.title === 'Pride and Prejudice'));
    if (prideAndPrejudice && prideAndPrejudice._id) {
      await updateBook(prideAndPrejudice._id.toHexString(), { genre: 'Classic Romance' });
      const updatedBook = await getBookById(prideAndPrejudice._id.toHexString());
      console.log('Updated Pride and Prejudice genre:', updatedBook?.genre);
    }

    // You can fetch all authors again to see if books array is updated
    console.log('\n--- Authors after book creation (check books array) ---');
    allAuthors = await getAllAuthors();
    console.log(allAuthors.map(a => ({ id: a._id, name: a.name, books: a.books?.map(bId => bId.toHexString()) })));


    console.log('\n--- Deleting a Book (e.g., Sense and Sensibility) ---');
    const senseAndSensibility = await getBooksByGenre('Romance').then(books => books.find(b => b.title === 'Sense and Sensibility'));
    if (senseAndSensibility && senseAndSensibility._id) {
      console.log(`Attempting to delete Sense and Sensibility (ID: ${senseAndSensibility._id})`);
      await deleteBook(senseAndSensibility._id.toHexString());
      const deletedBook = await getBookById(senseAndSensibility._id.toHexString());
      console.log('Sense and Sensibility exists after deletion?', deletedBook ? 'Yes' : 'No');
    }

    console.log('\n--- Authors after book deletion (check books array) ---');
    allAuthors = await getAllAuthors();
    console.log(allAuthors.map(a => ({ id: a._id, name: a.name, books: a.books?.map(bId => bId.toHexString()) })));

    console.log('\n--- Deleting an Author (e.g., George Orwell) ---');
    if (author2Id) {
      // NOTE: Deleting an author here does NOT automatically delete their books.
      // You would need to implement cascading deletion logic if that's a requirement.
      await deleteAuthor(author2Id.toHexString());
      const deletedAuthor = await getAuthorById(author2Id.toHexString());
      console.log('George Orwell exists after deletion?', deletedAuthor ? 'Yes' : 'No');
    }

  } catch (error) {
    console.error('An error occurred during operations:', error);
  } finally {
    await closeDB();
  }
}

run();
