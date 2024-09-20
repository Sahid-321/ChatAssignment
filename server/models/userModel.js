const pool = require('../config/db');

const createUser = async (username, password) => {
  const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
  const values = [username, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

const getUserByUsernamePass = async (username, password) => {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const result = await pool.query(query, [username, password]);
    return result.rows[0];
  };

module.exports = { createUser, getUserByUsername, getUserByUsernamePass };
