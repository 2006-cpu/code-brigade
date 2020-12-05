// Connect to DB
const { Client } = require('pg');
const DB_NAME = 'localhost:5432/graceshopper-dev'
const DB_URL = process.env.DATABASE_URL || `postgres://${DB_NAME}`;
const client = new Client(DB_URL);
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// database methods
async function getProductById(id) {
  try {
    const { rows: [product] } = await client.query(`
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
    const { rows: products } = await client.query(`
      SELECT * 
      FROM products
    `);

    return products
  } catch (error) {
    throw error;
  }
};


async function createProduct(product) {
  const { name, description, price, imageurl, inStock, category } = product
  try {
    const { rows: [newProduct] } = await client.query(`
      INSERT INTO products(name, description, price, imageurl, "inStock", category) 
      VALUES($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `, [name, description, price, imageurl, inStock, category]);

    return newProduct;
  } catch (error) {
    throw error;
  }
};


async function createUser({ firstName, lastName, email, imageurl, username, password, isAdmin }) {
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


async function getUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username = $1;
      `, [username]);
    console.log('theUser:', user)
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
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
    const { rows: [order] } = await client.query(`
      SELECT *
      FROM orders
      WHERE id=$1
      `, [id]);

    const { rows: productList } = await client.query(`
      SELECT products.*, order_products.id as "orderProductId", order_products."productId" as "productidentity", order_products."orderId", order_products.quantity
      FROM products
      JOIN order_products ON products.id=order_products."productId"
      WHERE order_products."orderId"=$1;
      `, [order.id])

    order.productList = productList

    return order;
  } catch (error) {
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
      const { rows: productList } = await client.query(`
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
      const { rows: productList } = await client.query(`
        SELECT products.*, order_products.price, order_products.quantity, order_products.id as "productCartItemId"
        FROM products
        JOIN order_products ON order_products."productId"=products.id
        WHERE "orderId" IN ($1)
        `, [order.id]);
      order.productList = productList
    }
    return ordersList
  } catch (error) {
    throw error;
  }
};

async function updateOrder({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  const objectVals = Object.values(fields)
  if (setString.length === 0) {
    return;
  }

  objectVals.push(id);
  try {
    const { rows: [order] } = await client.query(`
          UPDATE orders
          SET ${setString}
          WHERE id = $${objectVals.length}
          RETURNING *;
      `, objectVals);
    return order;
  } catch (error) {
    throw error;
  }
}


async function getCartByUser(userId) {
  try {
    const { rows: [cart] } = await client.query(`
      SELECT orders.*, users.username, users.id, orders.id
      FROM orders
      JOIN users on users.id=orders."userId"
      WHERE "userId"=$1 AND status='created'
      `, [userId])

    const { rows: productList } = await client.query(`
      SELECT products.*, order_products.id as "orderProductId", order_products."orderId", order_products.price as "cartPrice", order_products.quantity
      FROM products
      JOIN order_products ON products.id=order_products."productId"
      WHERE order_products."orderId"=$1;
      `, [cart.id])

    cart.productList = productList
    return cart;
  } catch (error) {
    throw error;
  }
};

async function getCartByOrderId(orderId) {
  try {
    const { rows: [cart] } = await client.query(`
      SELECT * 
      FROM orders
      WHERE id=$1 AND status='created'
      `, [orderId])

    const { rows: productList } = await client.query(`
      SELECT products.*, order_products.id as "orderProductId", order_products."orderId", order_products.price as "cartPrice", order_products.quantity
      FROM products
      JOIN order_products ON products.id=order_products."productId"
      WHERE order_products."orderId"=$1;
      `, [cart.id])

    cart.productList = productList
    return cart;
  } catch (error) {
    throw error;
  }
};

async function getOrdersByProduct({ id }) {
  try {
    const { rows: orders } = await client.query(`
      SELECT orders.*, order_products."productId"
      FROM order_products 
      INNER JOIN orders ON orders.id=order_products."orderId"
      WHERE "productId"=${id} 
    `);

    return orders;
  } catch (error) {
    throw error;
  }
}


async function createOrder({ status, userId }) {
  try {
    const { rows: [order] } = await client.query(`
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
  try {
    const { rows: [order_product] } = await client.query(`
    SELECT *
    FROM order_products
    WHERE id=$1
    `, [id])

    return order_product;
  } catch (error) {
    throw error;
  }
};

async function createOrderProductsList({ orderId, productId, price, quantity }) {
  try {
    const { rows: [orderProduct] } = await client.query(`
      INSERT INTO order_products("orderId", "productId", price, quantity)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `, [orderId, productId, price, quantity])

    return orderProduct;
  } catch (error) {
    throw error;
  }
};

async function destroyOrderProduct(id) {
  const { rows: [order_product] } = await client.query(`
      DELETE FROM order_products
      WHERE id = $1
      RETURNING *;
  `, [id])
  return order_product;
}

async function addProductToOrder({ orderId, productId, price, quantity }) {
  try {
    const orderList = await getOrdersByProduct({ id: productId })
    const index = orderList.findIndex(order => order.id === orderId)
    if (index === -1) {
      const newOrderProduct = await createOrderProductsList({ orderId, productId, price, quantity })

      return newOrderProduct
    } else {

      const orderDetails = await getOrderById(orderId)
      const findExistingOrderProduct = orderDetails.productList.find(singleProduct => singleProduct.productidentity === productId);
      const { rows: [changeOrderProduct] } = await client.query(`
      UPDATE order_products
      SET price=${price}, quantity=${quantity}
      WHERE id=${ findExistingOrderProduct.orderProductId}
      RETURNING *;
    `);
      return changeOrderProduct;

    }
  } catch (error) {
    throw error;
  }
};


async function getOrderProductByOrderIdProductIdPair(orderId, productId) {
  try {
    const { rows: [orderProduct] } = await client.query(`
        SELECT *
        FROM order_products
        WHERE "orderId"=${orderId} AND "productId"=${productId}
        `)

    return orderProduct;
  } catch (error) {
    throw error;
  }
};

//from Spencer's pr request 
async function updateOrderProduct({ id, price, quantity }) {
  const fields = { price, quantity }
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');
  if (setString.length === 0) {
    return;
  }
  try {

    const { rows: [orderProduct] } = await client.query(`
      UPDATE order_products
      SET ${ setString}
      WHERE id=${ id}
      RETURNING *;
      `, Object.values(fields));

    return orderProduct;
  } catch (error) {
    throw error;
  }
};


async function cancelOrder(id) {
  try {
    const { rows: [orderCancelled] } = await client.query(`
    UPDATE orders
    SET
    status='cancelled'
    WHERE id=$1
    RETURNING *
    `, [id])

    return orderCancelled;

  } catch (error) {
    throw error;
  }
};

async function completeOrder(id) {
  try {
    const { rows: [completedOrder] } = await client.query(`
    UPDATE orders
    SET
    status='completed'
    WHERE id=$1
    RETURNING *
    `, [id])

    return completedOrder;

  } catch (error) {
    throw error;
  }
};

async function updateProduct({ id, name, description, price, imageurl, inStock, category }) {
  const fields = { name, description, price, imageurl, inStock, category }
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');
  if (setString.length === 0) {
    return;
  }
  try {
    const { rows: [product] } = await client.query(`
  UPDATE products
  SET ${setString}
  WHERE id=${id}
  RETURNING *
  `, Object.values(fields))

    return product;

  } catch (error) {
    throw error;
  }
};
//updateUser Dec 3

async function updateUser({ id, firstName, lastName, email, imageurl, username, password, isAdmin }) {
  const fields = { firstName, lastName, email, imageurl, username, password, isAdmin }
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');
  if (setString.length === 0) {
    return;
  }
  try {
    const { rows: [user] } = await client.query(`
      UPDATE users
      SET ${ setString}
      WHERE id=${ id}
      RETURNING *;
      `, Object.values(fields));
    return user;
  } catch (error) {
    throw error;
  }
};


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
  updateOrder,
  getCartByUser,
  createOrder,
  createOrderProductsList,
  getOrderProductById,
  destroyOrderProduct,
  getOrdersByProduct,
  addProductToOrder,
  getOrderProductByOrderIdProductIdPair,
  updateOrderProduct,
  cancelOrder,
  completeOrder,
  getCartByOrderId,
  updateProduct,
  updateUser
  // db methods
}