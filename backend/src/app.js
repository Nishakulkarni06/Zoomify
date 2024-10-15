// import express from 'express';
// import { createServer } from 'node:http';
// import { Server } from 'socket.io'; 
// import mongoose from 'mongoose';
// import cors from 'cors';
// import { connectToSocket } from './controllers/socketManager.js';

// // socket io
// import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';

// const app = express();
// const httpServer = createServer(app); 
// // const io = connectToSocket(httpServer); 
// import userRoutes from "./routes/users.routes.js";  

// app.use(cors()); 
// app.use(express.json({limit:"40kb"}));
// app.use(express.urlencoded({limit:"40kb", extended:"true"}));
// app.set("port", process.env.PORT || 3000);

// // Your MongoDB connection string
// const mongoURI ="mongodb+srv://nishakulkarnidev:DA8guXz0jUfzg3ok@cluster0.z3nqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
// // const mongoURI = process.env.mongoURI; 
// // console.log(process.env.mongoURI);
// // const mongoURI = "mongodb://nishakulkarnidev:DA8guXz0jUfzg3ok";
// // mongodb://<username>:<password>@<host>:<port>/<dbname>

// const io = new Server(httpServer, {
//     connectionStateRecovery: {}
//   });

// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg);
//       });
//   });

// app.use("/api/v1/users",userRoutes);

// app.get('/home', (req, res) => {
//     return res.json({ "hello": "World" });
// });

// // socket io 
// const __dirname = dirname(fileURLToPath(import.meta.url));

// app.get("/hello",(req,res)=>{
//     res.sendFile(join(__dirname, 'index.html'));
// });
// const start = async () => {
//     try {
//         console.log('Connecting to MongoDB with URI:', mongoURI);  
        
//         const connectionDb = await mongoose.connect(mongoURI);
//         console.log(`MongoDB connected: ${connectionDb.connection.host}`);
//         httpServer.listen(app.get("port"), () => { 
//             console.log(`Listening on port ${app.get("port")}!`);
//         });
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error.message);
//         console.error('Full error object:', error);
//     }
// };

// start();


import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'; 
import mongoose from 'mongoose';
import cors from 'cors';
import { connectToSocket } from './controllers/socketManager.js';
import userRoutes from "./routes/users.routes.js";
// socket io
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const app = express();
const httpServer = createServer(app); 

// Setup CORS for Express
app.use(cors({
    origin: 'http://localhost:3001', // Frontend URL
    methods: ['GET', 'POST'],
    credentials: true // Allow credentials if needed
})); 

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.set("port", process.env.PORT || 3000);

// MongoDB connection string
const mongoURI = "mongodb+srv://nishakulkarnidev:DA8guXz0jUfzg3ok@cluster0.z3nqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

const io = connectToSocket(httpServer); 


app.use("/api/v1/users", userRoutes);

// Test route
app.get('/home', (req, res) => {
    return res.json({ "hello": "World" });
});

// Serve static HTML file
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/hello", (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Start the server and connect to MongoDB
const start = async () => {
    try {
        console.log('Connecting to MongoDB with URI:', mongoURI);  
        
        const connectionDb = await mongoose.connect(mongoURI);
        console.log(`MongoDB connected: ${connectionDb.connection.host}`);
        
        httpServer.listen(app.get("port"), () => { 
            console.log(`Listening on port ${app.get("port")}!`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        console.error('Full error object:', error);
    }
};

start();
