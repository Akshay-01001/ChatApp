import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:8000");

function App() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [username, setUsername] = useState("user");

  const sendMessage = () => {
    if(username === "user"){
      alert('enter diffrent username')
      return
    }

    if (message !== "") {
      const messageData = {
        message,
        id: socket.id,
        username: username,
      };
      socket.emit("message", messageData);
      setMessage("");
      // Add the sender's message to the list immediately
      setMessageList((list) => [...list, { id: "You", message }]);
    }
  };

  useEffect(() => {
    // Listen for messages from other clients
    socket.on("message_from_another", (data) => {
      // console.log("Message from another client:", data);
      setMessageList((list) => [...list, data]);
    });
  }, [setMessageList]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl mb-4">Chat App</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 w-2/3 mb-4 bg-gray-800 text-white border border-gray-600 rounded"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 w-2/3 bg-gray-800 text-white border border-gray-600 rounded"
        />
      </div>

      <button
        onClick={sendMessage}
        className="p-2 bg-blue-600 text-white rounded w-1/3"
      >
        Send
      </button>

      <div className="max-h-[400px] overflow-y-auto p-4 bg-gray-900 rounded mt-6">
        {messageList.map((msg, index) => (
          <div key={index} className="mb-3">
            <strong>{msg.username ? msg.username : "You"}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;