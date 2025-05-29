/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test');

// Search for documents in the current collection.
db.getCollection('expenses')
  .find(
    {
      cost: 0
    },
    {
      // Optional: Projection
      // _id: 0, // exclude _id
      // cost: 1 // include cost
    }
  )
  .sort({
    // Optional: sorting
    // createdAt: -1
  });
