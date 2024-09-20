const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { authenticateSocket } = require('./middleware/authMiddleware');
const pool = require('./config/db')
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');


// Static files
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));
app.get('/*', function (req, res) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests only from your frontend's URL
    credentials: true,                // Enable credentials if needed (cookies, headers, etc.)
  }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Real-time chat functionality with socket.io
io.use(authenticateSocket).on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
