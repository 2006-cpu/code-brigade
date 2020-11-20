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
  // delete user.password
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



// export
module.exports = {
  client,
  getProductById,
  getAllProducts,
  createProduct,
  createUser,
  getUser,
  getUserByUsername
  // db methods
}