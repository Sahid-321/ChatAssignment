const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "postgres.orbzritebiyoesjobedi",
  host: "aws-0-ap-south-1.pooler.supabase.com",
  database: "postgres",
  password: "Sahid@0056##",
  port: 6543,
  // ssl: {
  //   require: true,
  //   rejectUnauthorized: false,
  // },
});
  
  pool.connect((error, client, release) => {
    if (error) {
      console.error("Error connecting to the database:", error);
      return;
    }
  
    console.log("Database connected successfully!");
    // Release the client
    release();
  });
  
  module.exports = pool;