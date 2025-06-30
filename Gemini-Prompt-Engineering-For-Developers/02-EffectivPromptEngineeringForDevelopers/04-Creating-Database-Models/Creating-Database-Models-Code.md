Great, let's get into the code for these CRUD operations. We'll set up the database connection, define the TypeScript interfaces for our data models, and then implement the functions for managing authors and books.

Here's the code structure we'll follow:

src/db.ts: Handles the MongoDB connection.

src/models/Author.ts: Defines the TypeScript interface for Author.

src/models/Book.ts: Defines the TypeScript interface for Book.

src/services/authorService.ts: Contains CRUD functions for the authors collection.

src/services/bookService.ts: Contains CRUD functions for the books collection.

First, you'll need to install the mongodb package:

npm install mongodb
npm install --save-dev @types/mongodb

1. MongoDB Connection (src/db.ts)
This file will handle initializing and providing the MongoDB database client.

2. Models (TypeScript Interfaces)
These files define the shape of your documents, providing type safety for your application.

src/models/Author.ts
Author Model (src/models/Author.ts)


src/models/Book.ts
Book Model (src/models/Book.ts)

3. Services (CRUD Operations)
These files contain the functions for interacting with your collections.
src/services/authorService.ts
Author Service (src/services/authorService.ts)
Book Service (src/services/bookService.ts)


How to use these functions:
You can test these functions by creating a simple index.ts file or within your RESTful API routes.
Here's an example of how you might use them:
Example Usage (src/index.ts)

To run this example:

1. Make sure you have Node.js and npm installed.

2. Save the files into src/db.ts, src/models/Author.ts, src/models/Book.ts, src/services/authorService.ts, src/services/bookService.ts, and src/index.ts respectively.

3. Ensure your MongoDB server is running (e.g., mongod).

4. Compile the TypeScript:
npx tsc --init # If you don't have a tsconfig.json
npx tsc

5. Run the compiled JavaScript:

Bash

node dist/index.js

This code provides a robust set of CRUD operations for your library database, implementing the schema we discussed and handling the relationships between books and authors. The createBook and deleteBook functions also include logic to update the books array within the author document, maintaining data consistency for the references.