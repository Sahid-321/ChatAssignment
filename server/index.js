const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');
const authRoutes = require('./routes/authRoutes');  // Authentication routes (signup/signin)
const chatRoutes = require('./routes/chatRoutes');  // Chat routes (message handling)
const { authenticateSocket } = require('./middleware/authMiddleware');  // JWT-based socket authentication
const pool = require('./config/db');  // PostgreSQL configuration

const app = express();
const server = http.createServer(app);

// Allowed CORS Origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://chat-assignment-client.vercel.app'
];

// CORS Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(express.json());

// Serving static files from the React app
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));
app.get('/*', function (req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Routes
app.use('/api/auth', authRoutes);  // Auth routes
app.use('/api/chat', chatRoutes);  // Chat routes

// Socket.IO server initialization
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
  }
});

// Storing `io` in the app for future use (optional)
app.set("io", io);

// Handle socket connection
io.on("connection", (socket) => {
    console.log('Client connected with ID:', socket.id);

    // Handle incoming message
    socket.on("sendMessage", (message) => {
        console.log('Message received:', message);
        io.emit("receiveMessage", message);  // Broadcast the message to all clients
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Database connection
pool.connect((err, client, done) => {
    if (err) throw new Error('Failed to connect to database:', err);
    console.log('Connected to PostgreSQL database.');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
