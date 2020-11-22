// Connect to DB
const { Client } = require('pg');
const DB_NAME = 'localhost:5432/graceshopper-dev'
const DB_URL = process.env.DATABASE_URL || `postgres://${ DB_NAME }`;
const client = new Client(DB_URL);
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// database methods
async function getProductById(id) {
  try {
    const { rows: [ product ]  } = await client.query(`
          SELECT *
          FROM products
          WHERE id=$1;
        `, [id]);
    
        return product
  } catch (error) {
    throw error;
  }
};


async function getAllProducts() {

  try {
    const {rows: products} = await client.query(`
      SELECT * 
      FROM products
    `);

    return products
  } catch (error) {
    throw error;
  } 
};


async function createProduct(product) {

  const { name, description, price, imageURL, inStock, category } = product
  
  try {
   
    const { rows: [ newProduct ] } = await client.query(`
      INSERT INTO products(name, description, price, imageURL, "inStock", category) 
      VALUES($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `, [name, description, price, imageURL, inStock, category]);

       return newProduct;

  } catch (error) {
    throw error;
  }
};

async function createUser({firstName, lastName, email, imageurl, username, password, isAdmin}) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
      const { rows: [user] } = await client.query(`
      INSERT INTO users("firstName", "lastName", email, imageurl, username, password, "isAdmin")
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username;
  `, [firstName, lastName, email, imageurl, username, hashedPassword, isAdmin]);
  console.log('createdUser:', user)
  delete user.password
  return user;
  } catch (error) {
      throw error;
  }    
}

async function getUser({username, password}) {
  try {
      const {rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username = $1;
      `, [username]);
      console.log('theUser:', user)
      const isMatch = bcrypt.compareSync(password, user.password);
      if(!isMatch) {
          return;

      } else {
        delete user.password;

        return user;
      }    
  } catch (error) {
      throw error;
  }
}

async function getAllUsers() {
  try {
      const { rows } = await client.query(`
      SELECT *
      FROM users;
      `);
      return rows;
  } catch (error) {
      throw error;
  }
}

async function getUserById(id) {
  try {
      const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE id = $1;
      `, [id])
      delete user.password;
      return user;
  } catch (error) {
      throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `, [username]);

    console.log('user', user)

    return user;

  } catch (error) {
    throw error;
  }
}

//order by id
async function getOrderById(id) {
  try {
      const {rows: orderItems} = await client.query(`
        SELECT products.*, order_products.id, order_products.price, order_products.quantity
        FROM products
        JOIN order_products ON order_products."productId"=products.id
        WHERE order_products."orderId"=${id}
        `);
         
        return orderItems;
  } catch(error) {
    throw error;
  }
};

//all Orders
async function getAllOrders() {
  try {
    const { rows: allOrders } = await client.query(`
      SELECT orders.*, users.username as "person"
      FROM orders
      JOIN users on users.id=orders."userId"
      `)

    for (let order of orders) {
      const {rows: productList } = await client.query(`
      SELECT products.*, order_products.price, order_products.quantity, order_products.id as "productCartItemId"
      FROM products
      JOIN order_products ON order_products."productId"=products.id
      WHERE "orderId" IN ($1)
      `, [orders.id]);
      order.productList = productList
    }

    return allOrders

  } catch (error) {
  throw error;
  }
};

//get Orders by Username
  async function getOrdersByUser({username}) {
  try {
      const { rows: ordersList } = await client.query(`
      SELECT orders.*, users.username as "person"
      FROM orders
      JOIN users on users.id=orders."userId"
      WHERE username='${username}'
      `)

      for (let order of orders) {
        const { rows: productList} = await client.query(`
        SELECT products.*, order_products.price, order_products.quantity, order_products.id as "productCartItemId"
        FROM products
        JOIN order_products ON order_products."productId"=products.id
        WHERE "orderId" IN ($1)
        `, [orders.id]);
        order.productList = productList
      }

      return ordersList

  } catch(error) {
    throw error;
  }
};

async function getOrdersByProduct({id}) {
  try {
    const { rows: orders } = await client.query(`
      SELECT orders.*
      FROM order_products 
      INNER JOIN orders ON "orderId"=orders.id
      WHERE "productId"=${id} 
    `);

    return orders;
  } catch (error) {
    throw error;
  }
}



// export
module.exports = {
  client,
  getProductById,
  getAllProducts,
  createProduct,
  createUser,
  getUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getOrderById,
  getAllOrders,
  getOrdersByUser
  // db methods
}