const MongoClient = require('mongodb').MongoClient
 
// The method "connect" returns a Promise of Connection.
// ".then" takes the connection as a parameter and returns the Promise of a database
// (i.e. to a connector connected to the database).

const mongodbPromise = MongoClient.connect(process.env.MONGODB_URL, { useUnifiedTopology: true })
  .then(client => client.db(process.env.MONGODB_DB_NAME))

// What we export is the Promise of a database, not the database in itself.
module.exports = mongodbPromise