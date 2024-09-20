const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    
    req.userId = decoded.userId;
    next();
  });
};

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.userId = decoded.userId;
    next();
  });
};

module.exports = { authenticate, authenticateSocket };
