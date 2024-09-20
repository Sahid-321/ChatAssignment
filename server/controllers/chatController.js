const sendMessage = (io) => {
  return (req, res) => {
    const { message} = req.body;

    // Emit the message to the room via Socket.IO
    io.emit('receiveMessage', message);

    res.status(200).json({ message: 'Message sent successfully' });
  };
};

module.exports = { sendMessage };
