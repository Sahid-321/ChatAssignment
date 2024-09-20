const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/userModel');

const signup = async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if(user){
  return  res.json({message:"This user already exist"})
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(username, hashedPassword);
  res.json({message:"User Created successfully"});
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token });
};

module.exports = { signup, login };
