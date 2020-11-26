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

      delete user.password
      return user;
  } catch (error) {
    throw error;
  }    
};


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
};

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
};


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
};


async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `, [username]);

      return user;
  } catch (error) {
    throw error;
  }
};


async function getOrderById(id) {
  try {
    const {rows: [order]} = await client.query(`
      SELECT *
      FROM orders
      WHERE id=$1
      `, [id]);

      const { rows: productList }  = await client.query(`
      SELECT products.*
      FROM products
      JOIN order_products ON products.id=order_products."orderId"
      WHERE order_products."orderId"=$1;
      `, [order.id])  

      order.productList = productList
         
      return order;
  } catch(error) {
    throw error;
  }
};


async function getAllOrders() {
  try {
    const { rows: allOrders } = await client.query(`
      SELECT orders.*, users.username
      FROM orders
      JOIN users on users.id=orders."userId"
      `)

    for (let order of allOrders) {
      const {rows: productList } = await client.query(`
      SELECT products.*, order_products.price, order_products.quantity, order_products.id as "productCartItemId"
      FROM products
      JOIN order_products ON order_products."productId"=products.id
      WHERE "orderId" IN ($1)
      `, [order.id]);
      order.productList = productList
    }

    return allOrders
  } catch (error) {
  throw error;
  }
};


async function getOrdersByUser(userId) {
  try {
      const { rows: ordersList } = await client.query(`
      SELECT orders.*, users.username
      FROM orders
      JOIN users on users.id=orders."userId"
      WHERE users.id=$1
      `, [userId])

      for (let order of ordersList) {
        const { rows: productList} = await client.query(`
        SELECT products.*, order_products.price, order_products.quantity, order_products.id as "productCartItemId"
        FROM products
        JOIN order_products ON order_products."productId"=products.id
        WHERE "orderId" IN ($1)
        `, [order.id]);
        order.productList = productList
      }
      return ordersList
  } catch(error) {
    throw error;
  }
};


async function getCartByUser(userId) {
  try {
    const { rows: [cart] } = await client.query(`
      SELECT *
      FROM orders
      WHERE "userId"=$1 AND status='created'
      `, [userId])

    const { rows: productList }  = await client.query(`
      SELECT products.*
      FROM products
      JOIN order_products ON products.id=order_products."orderId"
      WHERE order_products."orderId"=$1;
      `, [cart.id])  

      cart.productList = productList
      return cart;
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


async function createOrder({ status, userId }) {
  try {
    const { rows: [ order ] } = await client.query(`
      INSERT INTO orders(status, "userId") 
      VALUES($1, $2)
      RETURNING *;
      `, [status, userId]);

      return order;
  } catch (error) {
    throw error;
  }
};

async function getOrderProductById(id) {
  try  {
    const { rows: [orderProduct] } = await client.query(`
    SELECT *
    FROM order_products
    WHERE id=$1
    `[id])

    return orderProduct

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
  getOrdersByUser,
  getCartByUser,
  createOrder
  // db methods
}