const express = require('express');
const { sendMessage } = require('../controllers/chatController');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

router.post('/send', authenticate, sendMessage);

module.exports = router;
