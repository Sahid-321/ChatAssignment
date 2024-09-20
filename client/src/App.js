import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);

  const handleSignup = async () => {
    const response = await axios.post('http://localhost:3000/api/auth/signup', { username, password });
    alert(response.data.message);
  };

  const handleLogin = async () => {
    const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
    setToken(response.data.token);
    socket.auth = { token: response.data.token };
    alert('Logged in');
  };

  const sendMessage = () => {
    socket.emit('sendMessage', message);
    setMessage('');
  };

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);  // Append new message to messages array
    });
  
    // Clean up the socket event listener when component unmounts
    return () => {
      socket.off('receiveMessage');
    };
  }, []);
  
console.log(message, "message");
  return (
    <div>
      <h1>Real-Time Chat</h1>
      
      {!token ? (
        <>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleSignup}>Sign Up</button>
          <button onClick={handleLogin}>Log In</button>
        </>
      ) : (
        <>
          <input placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
          
          <div>
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
