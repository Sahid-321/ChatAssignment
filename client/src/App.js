import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css"; // Move styles to an external file for maintainability

const socket = io("https://chatassignment-api.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const response = await axios.post(
      "https://chatassignment-api.onrender.com/api/auth/signup",
      { username, password }
    );
    alert(response.data.message);
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    const response = await axios.post(
      "https://chatassignment-api.onrender.com/api/auth/login",
      { username, password }
    );
    setToken(response.data.token);
    socket.auth = { token: response.data.token };
    alert("Logged in");
    setLoading(false);
  };

  const sendMessage = () => {
    socket.emit("sendMessage", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="app">
      <div className="chat-container">
        <h1>Real-Time Chat</h1>

        {!token ? (
          <div className="auth-form">
            <input
              className="input-field"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loading ? (
              <button className="auth-btn">Loading ...</button>
            ) : (
              <button className="auth-btn" onClick={handleSignup}>
                Sign Up
              </button>
            )}
            {loading ? (
              <button className="auth-btn">Loading ...</button>
            ) : (
              <button className="auth-btn" onClick={handleLogin}>
                Log In
              </button>
            )}
          </div>
        ) : (
          <div className="chat-section">
            <div className="message-box">
              {messages.map((msg, index) => (
                <p key={index} className="message">
                  {msg}
                </p>
              ))}
            </div>
            <div className="input-section">
              <input
                className="message-input"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="send-btn" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
