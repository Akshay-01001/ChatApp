import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:8000");

function App() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState(null);
  const [joinedRoom, setJoinedRoom] = useState(false);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        roomName,
        username,
        message,
      };
      socket.emit("message", messageData);
      setMessage("");
      setMessageList((list) => [...list, { username: "You", message }]);
    }
  };

  const joinRoom = () => {
    if (!username || !roomName) {
      alert("Please enter both username and room name!");
      return;
    }
    socket.emit("join-room", { roomName, username });
    setJoinedRoom(true);
  };

  const leaveRoom = () => {
    socket.emit("leave-room", { roomName, username });
    setJoinedRoom(false);
    setMessageList([]);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("recv-msg", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("room-message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl mb-4">Chat App</h1>
      <h6 className="p-2 border mb-10">Your ID: {socketId}</h6>

      {!joinedRoom ? (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 w-2/3 mb-4 bg-gray-800 text-white border border-gray-600 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="p-2 w-2/3 mb-4 bg-gray-800 text-white border border-gray-600 rounded"
            />
          </div>
          <button
            onClick={joinRoom}
            className="p-2 bg-blue-600 text-white rounded w-1/3"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div>
          <p className="border p-2 mb-10 mt-4">You are in Room: {roomName}</p>
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
          <button
            onClick={leaveRoom}
            className="p-2 bg-red-600 text-white rounded w-1/3 ml-4"
          >
            Leave Room
          </button>
          <div className="max-h-[400px] overflow-y-auto p-4 rounded mt-6">
            {messageList.map((msg, index) => (
              <div key={index} className="mb-3">
                <strong>{msg.username}:</strong> {msg.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
