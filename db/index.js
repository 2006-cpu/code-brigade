// Connect to DB
const { Client } = require('pg');
// const DB_NAME = 'graceshopper-dev'
// grace-shopper
const DB_NAME = 'localhost:5432/graceshopper-dev'
const DB_URL = process.env.DATABASE_URL || `postgres://${ DB_NAME }`;
const client = new Client(DB_URL);

// database methods
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

// export
module.exports = {
  client,
  getAllProducts
  // db methods
}