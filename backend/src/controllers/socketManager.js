// import path from "path";
// import {Server} from "socket.io";

// let connections = {};
// let messages = {};
// let timeOnLine= {}; 

// export const connectToSocket = (server)=>{
//     const io = new Server(server,{
//         cors:{
//             origin : "*",
//             methods : ["GET","POST"],
//             allowedHeaders : ["*"],
//             credentials: true 
//         }
//     });
  
//     io.on("connection",(socket)=>{
     
//         socket.on("join-call",()=>{
              
//             if(connections[path] === undefined){
//                 connections[path] = []; 
//             }
//             connections[path].push(socket.id); 
//             timeOnLine[socket.id] = new Date(); 

//             connections[path].forEach(elem =>{
//               io.to(elem).emit("user-joined",socket.id,connections[path])
//             });

//             if(messages[path] !== undefined){
//                 messages[path].forEach(elem =>{
//                     io.to(socket.id).emit("chat-message",messages[path]['data'],
//                         messages[path]['sender'],messages[path]['socket-id-sender']
//                     )
//                 });
//             }
//         });

//         socket.on("signal",(toId, message)=>{
//            io.to(toId).emit("signal",socket.id,message); 
//         }); 

//         socket.on("chat-message",(data,sender)=>{
            
//             const [matchingRoom,isFound] = object.entries(connections)
//             .reduce(([room , isFound],[roomKey,roomValue])=>{
//                 if(!isFound && roomValue.includes(socket.id)){
//                     return [roomKey,true]; 
//                 }
//                 return [room,isFound];
//             },['',false]); 

//             if(isFoundfound === true){
//                 if(messages[matchingRoom] === undefined){
//                     messages[matchingRoom] = [];
//                 }
//                 messages[matchingRoom].push({'sender' : sender , 'data':data ,'socket-id-sender':socket.id})
//                 console.log("message",key,":",sender,data);

//                 connections[matchingRoom].forEach((elem)=>{
//                     io.to(elem).emit("chat-message",data,sender,socket.id);
//                 })
//             }
//         });

//         socket.on("disconnect",()=>{
//                var diffTime = Math.abs(timeOnLine[socket.id]-new Date());
//                var key 

//                for(const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){

//                 for(let a = 0 ; a < v.length ; ++a){
//                     if(v[a] === socket.id){
//                         key = k ;
//                         for(let a = 0 ; a < connections[key].length ; ++a){
//                             io.to(connections[key][a]).emit('user-left',socket-id);
//                         }
//                     var index = connections[key].indexOf(socket.id);
//                     connections[key].splice(index,1);

//                     if(connections[key].length === 0){
//                         delete connections[key]; 
//                     }
//                     }
//                 }
//                }
//         });
//     })
//     return io; 
// } 

// import path from "path";
// import { Server } from "socket.io";

// let connections = {};
// let messages = {};
// let timeOnLine = {};

// export const connectToSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//       allowedHeaders: ["*"],
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     socket.on("join-call", (room) => {
//       // Use room as a unique identifier (e.g., window.location.href on the client)
//       if (!connections[room]) {
//         connections[room] = [];
//       }
//       connections[room].push(socket.id);
//       timeOnLine[socket.id] = new Date();

//       // Notify all users in the room that a new user has joined
//       io.to(room).emit("user-joined", socket.id, connections[room]);

//       // Send existing chat history to the new user
//       if (messages[room]) {
//         messages[room].forEach((message) => {
//           io.to(socket.id).emit(
//             "chat-message",
//             message.data,
//             message.sender,
//             message["socket-id-sender"]
//           );
//         });
//       }

//       socket.join(room); // Join the room
//     });

//     // Handle signaling messages between peers
//     socket.on("signal", (toId, message) => {
//       io.to(toId).emit("signal", socket.id, message);
//     });

//     // Handle chat messages
//     socket.on("chat-message", (data, sender) => {
//       // Find the room the user is in
//       const [matchingRoom, isFound] = Object.entries(connections).reduce(
//         ([room, isFound], [roomKey, roomValue]) => {
//           if (!isFound && roomValue.includes(socket.id)) {
//             return [roomKey, true];
//           }
//           return [room, isFound];
//         },
//         ["", false]
//       );

//       if (isFound) {
//         if (!messages[matchingRoom]) {
//           messages[matchingRoom] = [];
//         }

//         messages[matchingRoom].push({
//           sender: sender,
//           data: data,
//           "socket-id-sender": socket.id,
//         });

//         // Broadcast the message to all users in the room
//         connections[matchingRoom].forEach((clientId) => {
//           io.to(clientId).emit("chat-message", data, sender, socket.id);
//         });
//       }
//     });

//     // Handle user disconnection
//     socket.on("disconnect", () => {
//       const diffTime = Math.abs(timeOnLine[socket.id] - new Date());

//       // Loop through rooms and remove the disconnected user
//       Object.entries(connections).forEach(([roomKey, roomValue]) => {
//         const index = roomValue.indexOf(socket.id);
//         if (index !== -1) {
//           // Notify other users in the room
//           connections[roomKey].forEach((clientId) => {
//             io.to(clientId).emit("user-left", socket.id);
//           });

//           // Remove the user from the room
//           roomValue.splice(index, 1);

//           // Clean up the room if it's empty
//           if (roomValue.length === 0) {
//             delete connections[roomKey];
//           }
//         }
//       });
//     });
//   });

//   return io;
// };

import path from "path"; // Consider removing this if not used
import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnLine = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-call", (room) => {
      // Use room as a unique identifier (e.g., window.location.href on the client)
      if (!connections[room]) {
        connections[room] = [];
      }
      connections[room].push(socket.id);
      timeOnLine[socket.id] = new Date();

      socket.join(room); // Join the room here

      // Notify all users in the room that a new user has joined
      io.to(room).emit("user-joined", socket.id, connections[room]);

      // Send existing chat history to the new user
      if (messages[room]) {
        messages[room].forEach((message) => {
          io.to(socket.id).emit(
            "chat-message",
            message.data,
            message.sender,
            message["socket-id-sender"]
          );
        });
      }
    });

    // Handle signaling messages between peers
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // Handle chat messages
    socket.on("chat-message", (data, sender) => {
      // Find the room the user is in
      const [matchingRoom, isFound] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );

      if (isFound) {
        if (!messages[matchingRoom]) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });

        // Broadcast the message to all users in the room
        connections[matchingRoom].forEach((clientId) => {
          io.to(clientId).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      const diffTime = Math.abs(timeOnLine[socket.id] - new Date());

      // Loop through rooms and remove the disconnected user
      Object.entries(connections).forEach(([roomKey, roomValue]) => {
        const index = roomValue.indexOf(socket.id);
        if (index !== -1) {
          // Notify other users in the room
          roomValue.forEach((clientId) => {
            io.to(clientId).emit("user-left", socket.id);
          });

          // Remove the user from the room
          roomValue.splice(index, 1);

          // Clean up the room if it's empty
          if (roomValue.length === 0) {
            delete connections[roomKey];
          }
        }
      });
    });
  });

  return io;
};
