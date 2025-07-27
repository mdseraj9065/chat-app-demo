import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useMemo } from "react";

function App() {
  const socket = useMemo(() => io("http://localhost:1234"), []);

  const [message, setMessage] = useState("");
  const [room, setRomm] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected to the client side", socket.id);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    socket.on("recieved-message", (message) => {
      console.log("recieved message : ", message);
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          id="outlined-basis"
          label="Message"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        ></TextField>

        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basis"
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextField>

        <TextField
          id="outlined-basis"
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRomm(e.target.value)}
        ></TextField>
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );  
}

export default App;
