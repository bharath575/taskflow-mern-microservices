// import { io } from "socket.io-client";

// const socket = io("http://localhost:5002");

// export default socket;


import { io } from "socket.io-client";

const socket = io("http://localhost:5004", {
  transports: ["websocket"], // faster + clean
});

export default socket;

