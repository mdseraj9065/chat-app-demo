import React, { useEffect } from 'react'
import {io} from "socket.io-client";


function App() {
  const socket = io("http://localhost:1234");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the client side", socket.id);
    });

    socket.on("welcome", (msg) => {
      console.log( msg);
    });
  }, []);

  

  return (
    <div>App</div>
  )
}

export default App