// code to build and initialize DB goes here
const {
  client
  // other db methods 
} = require('./index');

async function dropTables() {
  try {

    console.log("starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS order_products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    `);
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  try {

    console.log("starting to build tables...");
    await client.query(`
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      price INTEGER NOT NULL,
      imageURL VARCHAR(255) NOT NULL,
      "inStock" BOOLEAN DEFAULT false,
      category VARCHAR(255) NOT NULL 
    );
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email citext NOT NULL UNIQUE,
      imageURL VARCHAR(255) NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) UNIQUE NOT NULL,
      "isAdmin" NOT NULL BOOLEAN DEFAULT false
    )
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      status text DEFAULT "created",
      "userId" INTEGER REFERENCES users(id)
      "datePlaced" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP + interval '1 day'
    )
    CREATE TABLE order_products (
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id),
      "orderId" INTEGER REFERENCES orders(id),
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0
    )
    `);

  } catch (error) {
    throw error;
  }
}

async function buildTables() {
  try {
    client.connect();

    await dropTables();
    await createTables();
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());