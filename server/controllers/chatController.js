const xss = require('xss');

const sendMessage = (req, res) => {
  const { message } = req.body;
  
  // Sanitize the input to remove any potential XSS payload
  const sanitizedMessage = xss(message);

  // Broadcast the sanitized message to other users
  io.emit('receiveMessage', sanitizedMessage);

  res.status(200).json({ message: 'Message sent successfully' });
};

module.exports = { sendMessage };
