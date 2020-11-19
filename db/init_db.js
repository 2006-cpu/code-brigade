// code to build and initialize DB goes here
const {
  client, createProduct
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
      imageURL VARCHAR(255),
      "inStock" BOOLEAN DEFAULT false,
      category VARCHAR(255) NOT NULL 
    );
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      "firstName" VARCHAR(255) NOT NULL,
      "lastName" VARCHAR(255) NOT NULL,
      email TEXT UNIQUE NOT NULL,
      imageURL VARCHAR(255),
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) UNIQUE NOT NULL,
      "isAdmin" BOOLEAN DEFAULT false NOT NULL
    );
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      status VARCHAR(255) DEFAULT 'created',
      "userId" INTEGER REFERENCES users(id),
      "datePlaced" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP + interval '1 day'
    );
    CREATE TABLE order_products (
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id),
      "orderId" INTEGER REFERENCES orders(id),
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0
    );

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
    console.log('Starting to create products...')
    const productsToCreate = [
      { name: 'camo masks', description: 'adult sizes', price: 5, imageURL: 'https://gracious-mcnulty-e733ac.netlify.app/images/sewingmachine.jpg', inStock: true, category: 'adults'},
      { name: 'Golden Gopher masks', description: 'for kids', price: 2, imageURL: 'https://gracious-mcnulty-e733ac.netlify.app/images/kidsmasks.jpg', inStock: true, category: 'kids'}
      ]
    // create useful starting data
    console.log('products created')
    const products = await Promise.all(productsToCreate.map(createProduct))
    
    console.log("The Products", products)
    console.log('Finished creating products!');

  } catch (error) {
    console.error('Error creating products!');
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());