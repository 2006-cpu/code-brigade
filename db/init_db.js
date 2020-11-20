// code to build and initialize DB goes here
const {
  client, 
  createProduct,
  getProductById,
  getAllProducts,
  createUser,
  getUser,
  getUserByUsername
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
      imageURL VARCHAR(255) DEFAULT 'https://gracious-mcnulty-e733ac.netlify.app/images/sewingmachine.jpg',
      "inStock" BOOLEAN DEFAULT false,
      category VARCHAR(255) NOT NULL 
    );
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      "firstName" VARCHAR(255) NOT NULL,
      "lastName" VARCHAR(255) NOT NULL,
      email TEXT UNIQUE NOT NULL,
      imageURL VARCHAR(255) DEFAULT 'http://www.freeimageslive.com/galleries/sports/moods_emotions/preview/happy_face.jpg',
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
    await createInitialProducts();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log('Starting to create products...')
    const productsToCreate = [
      { name: 'camo masks', description: 'adult sizes', price: 5, imageURL: 'https://gracious-mcnulty-e733ac.netlify.app/images/sewingmachine.jpg', inStock: true, category: 'adults'},
      { name: 'Golden Gopher masks', description: 'for kids', price: 2, imageURL: 'https://gracious-mcnulty-e733ac.netlify.app/images/kidsmasks.jpg', inStock: true, category: 'kids'}
      ]

      // const usersToCreate = [
      //   {firstName: 'Berto', lastName: 'One', email: 'albert@gmail.com', imageurl: 'https://picsum.photos/200', username: 'albert', password: 'berto99', isAdmin: false},
      //   {firstName: 'Sandy', lastName: 'Two', email: 'sandra@gmail.com', imageurl: 'https://picsum.photos/200', username: 'sandy', password: 'glamgal', isAdmin: false}
      // ]
    // create useful starting data
    console.log('products created')
    const products = await Promise.all(productsToCreate.map(createProduct))

    // console.log('users created')
    // const users = await Promise.all(usersToCreate.map(createUser))
    
    console.log("The Products", products)
    console.log('Finished creating products!');

    // console.log("The Users", users)
    // console.log('Finished creating users!');

  } catch (error) {
    console.error('Error creating products!');
    throw error;
  }
}

async function createInitialUsers() {
  console.log('Starting to create users...');
  try {

    const usersToCreate = [
      {firstName: 'Berto', lastName: 'One', email: 'albert@gmail.com', imageurl: 'https://picsum.photos/200', username: 'albert', password: 'berto99', isAdmin: false},
      {firstName: 'Sandy', lastName: 'Two', email: 'sandra@gmail.com', imageurl: 'https://picsum.photos/200', username: 'sandy', password: 'glamgal', isAdmin: false}
    ]
    // const usersToCreate = [
    //   {username: 'albert', password: 'berto99'},
    //   {username: 'sandy', password: 'glamgal'}
    // ]
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling createProduct");
    const newProduct = await createProduct({name: 'french mask', description:'keeps you warm at night', price: '10', imageURL:'https://gracious-mcnulty-e733ac.netlify.app/images/sewingmachine.jpg', inStock: true, category: 'adults'})
    console.log("Result:", newProduct);

    console.log("Calling getAllProducts");
    const products = await getAllProducts();
    console.log("Result:", products);

    console.log("Calling getProductById with 1");
    const item1 = await getProductById(1);
    console.log("Result:", item1);

    console.log("Calling createUser");
    const newUser = await createUser({firstName:'Jeanne', lastName:'Dupont', email:'JeanneDupont@gmail.com', imageurl:'https://picsum.photos/200', username:'petitefleur', password:'messagesecret', isAdmin: false});
    console.log("Result:", newUser);

    console.log("Calling getUser");
    const user = await getUser({username:'albert', password:'berto99'});
    console.log("Result:", user);
    
    console.log("Calling getUserByUsername with albert");
    const albert = await getUserByUsername("albert");
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}


buildTables()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());