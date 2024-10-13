import path from "path";
import {Server} from "socket.io";

let connections = {};
let messages = {};
let timeOnLine= {}; 

export const connectToSocket = (server)=>{
    const io = new Server(server,{
        cors:{
            origin : "*",
            methods : ["GET","POST"],
            allowedHeaders : ["*"],
            credentials: true 
        }
    });
  
    io.on("connection",(socket)=>{
     
        socket.on("join-call",()=>{
              
            if(connections[path] === undefined){
                connections[path] = []; 
            }
            connections[path].push(socket.id); 
            timeOnLine[socket.id] = new Date(); 

            connections[path].forEach(elem =>{
              io.to(elem).emit("user-joined",socket.id,connections[path])
            });

            if(messages[path] !== undefined){
                messages[path].forEach(elem =>{
                    io.to(socket.id).emit("chat-message",messages[path]['data'],
                        messages[path]['sender'],messages[path]['socket-id-sender']
                    )
                });
            }
        });

        socket.on("signal",(toId, message)=>{
           io.to(toId).emit("signal",socket.id,message); 
        }); 

        socket.on("chat-message",(data,sender)=>{
            
            const [matchingRoom,isFound] = object.entries(connections)
            .reduce(([room , isFound],[roomKey,roomValue])=>{
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey,true]; 
                }
                return [room,isFound];
            },['',false]); 

            if(isFoundfound === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({'sender' : sender , 'data':data ,'socket-id-sender':socket.id})
                console.log("message",key,":",sender,data);

                connections[matchingRoom].forEach((elem)=>{
                    io.to(elem).emit("chat-message",data,sender,socket.id);
                })
            }
        });

        socket.on("disconnect",()=>{
               var diffTime = Math.abs(timeOnLine[socket.id]-new Date());
               var key 

               for(const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){

                for(let a = 0 ; a < v.length ; ++a){
                    if(v[a] === socket.id){
                        key = k ;
                        for(let a = 0 ; a < connections[key].length ; ++a){
                            io.to(connections[key][a]).emit('user-left',socket-id);
                        }
                    var index = connections[key].indexOf(socket.id);
                    connections[key].splice(index,1);

                    if(connections[key].length === 0){
                        delete connections[key]; 
                    }
                    }
                }
               }
        });
    })
    return io; 
} 