const sendMessage = (req, res) => {
    const { message } = req.body;
    // Handle message broadcast logic (Socket.IO can also be used here)
    res.status(200).json({ message: 'Message sent successfully' });
  };
  
  module.exports = { sendMessage };
  