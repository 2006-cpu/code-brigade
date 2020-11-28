// code to build and initialize DB goes here
const {
  client, 
  createProduct,
  getProductById,
  getAllProducts,
  createUser,
  getUser,
  getUserByUsername,
  getAllUsers,
  getUserById,
  createOrder,
  getOrderById,
  getAllOrders,
  getOrdersByUser,
  updateOrder,
  getCartByUser,
  createOrderProductsList,
  getOrderProductById,
  getOrdersByProduct,
  addProductToOrder,
  getOrderProductByOrderIdProductIdPair
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
      imageURL VARCHAR(255) NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) UNIQUE NOT NULL,
      "isAdmin" BOOLEAN DEFAULT false
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
    await createInitialOrders();
    await createInitialOrderProductList();
  } catch (error) {
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log('Starting to create products...')
    const productsToCreate = [
      { name: 'Sports Team masks', description: 'adult sizes', price: 5, imageURL: 'https://gracious-mcnulty-e733ac.netlify.app/images/sewingmachine.jpg', inStock: true, category: 'adults'},
      { name: 'Marvel masks', description: 'for kids', price: 2, imageURL: 'https://gracious-mcnulty-e733ac.netlify.app/images/kidsmasks.jpg', inStock: true, category: 'kids'},
      { name: 'Christmas masks', description: 'great as a gift', price: 3, imageURL: 'https://images-na.ssl-images-amazon.com/images/I/61M4QKuk0-L._AC_SL1024_.jpg', inStock: true, category: 'adults'}
      ]

    console.log('products created')
    const products = await Promise.all(productsToCreate.map(createProduct))
    
    console.log("The Products", products)
    console.log('Finished creating products!');

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
      {firstName: 'Sandy', lastName: 'Two', email: 'sandra@gmail.com', imageurl: 'https://picsum.photos/200', username: 'sandy', password: 'glamgal', isAdmin: false},
      {firstName: 'Code', lastName: 'Brigade', email: 'codebrigade@gmail.com', imageurl: 'https://picsum.photos/200', username: 'codebrigade', password: 'codebrigade', isAdmin: true}
    ]

    const users = await Promise.all(usersToCreate.map(createUser));

    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}

async function createInitialOrders() {
  try {
    console.log('starting to create orders...');

    const ordersToCreate = [
      {status: 'created', userId: 1},
      {status: 'completed', userId: 1},
      {status: 'cancelled', userId: 1},
      {status: 'completed', userId: 2},
      {status: 'created', userId: 2},
      {status: 'created', userId: 3},
      {status: 'cancelled', userId: 3},
      {status: 'completed', userId: 3}
    ]
    const orders = await Promise.all(ordersToCreate.map(order => createOrder(order)));
    console.log('Orders Created: ', orders)
    console.log('Finished creating orders.')
  } catch (error) {
    throw error;
  }
}


async function createInitialOrderProductList() {
  try {
    console.log('Starting to create Order Products...');

    const orderProductsToCreate = [
      {productId: 1, orderId: 1, price: 5, quantity: 1},
      {productId: 3, orderId: 3, price: 3, quantity: 1},
      {productId: 2, orderId: 5, price: 2, quantity: 1},
      {productId: 3, orderId: 6, price: 3, quantity: 1},
      {productId: 1, orderId: 8, price: 5, quantity: 1},
    ]
    const orderProductList = await Promise.all(orderProductsToCreate.map(orderProduct => createOrderProductsList(orderProduct)));
    console.log('Order Products Created: ', orderProductList)
    console.log('Finished creating Order Products.')
  } catch (error) {
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
    const albert1 = await getUserByUsername("albert");
    console.log("Result:", albert1);

    console.log("Calling getAllUsers");
    const allUsers = await getAllUsers();
    console.log("All Users List Result:", allUsers)

    console.log("Calling getUserById with Sandy 1");
    const sandy = await getUserById(1);
    console.log("getUserById Result:", sandy)

    console.log("Calling getOrderById with Order id 1");
    const firstOrder = await getOrderById(1)
    console.log("Find order by ID:", firstOrder)

    console.log("Calling getAllOrders");
    const allOrders = await getAllOrders()
    console.log("See all orders", allOrders)

    console.log("Calling getOrdersByUser ID 3");
    const ordersOfUser = await getOrdersByUser(3)
    console.log("See Orders by User ID:", ordersOfUser)

    console.log("Get Open Cart by User Id");
    const cartByUserId = await getCartByUser(3)
    console.log("Cart by User id", cartByUserId) 

    console.log("Get order product by Id");
    const orderProductById = await getOrderProductById(1)
    console.log("Get Order Product", orderProductById)

    console.log("Testing Functions for addProductToOrder and First, we check to see list of orders with product id passed in for product Id 3 ")
    const orderList = await getOrdersByProduct({id:3})
    const index = orderList.findIndex(order => order.id === 3)
    console.log("What are the results:", orderList)
    console.log("What is the index", index)
    
    console.log("Testing a non-existing product in order First, we check to see list of orders with product id passed in for product Id 4")
    const nonExist = await getOrdersByProduct({id:4})
    console.log("Testing a non-existing product ID in an order returns an empty array:", nonExist)

    //TEST Nov 27 for New - tested on Nov 27th and it works
    // const addingProductOrderForNewCombo = await addProductToOrder({ orderId: 5, productId: 4, price: 20, quantity: 3})
    // console.log("What is addingProductOrder Result for TEST Nov 27 Should be new Order Product Id", addingProductOrderForNewCombo)

    // TEST 5 for Existing - tested on Nov 27th and it works
    // const addingProductToExistingOrderProduct = await addProductToOrder({orderId: 5, productId: 2, price: 23, quantity: 24})
    // console.log("What is the result of TEST 5 addProductToOrder for existing order Id and product combo", addingProductToExistingOrderProduct)
    // console.log("Finished TEST 5")

    console.log("Testing getOrderProductByOrderIdProductIdPair(orderId, productId)")
    const getThePairOrderProductId = await getOrderProductByOrderIdProductIdPair(8, 1)
    console.log("What is the id using the getOrderProductByOrderIdProductIdPair(orderId, productId), should be id: 5", getThePairOrderProductId)
    
    console.log("Testing getOrderProductByOrderIdProductIdPair(orderId, productId) that does not exist")
    const getThePairOrderProductId2 = await getOrderProductByOrderIdProductIdPair(2, 2)
    console.log("What is the id using the getOrderProductByOrderIdProductIdPair(orderId, productId), should not exist returns undefined", getThePairOrderProductId2)

    console.log("Update order status and userId")
    const orderUpdated = await updateOrder({id: 5, status: 'completed', userId: 1}) 
    console.log("See updated order:", orderUpdated)

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