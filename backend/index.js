
import express from 'express';
import http from 'http'
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIoServer } from 'socket.io';
import { connectDB } from './config/database.js';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
export const io = new SocketIoServer(server);
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/threads', postRouter);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
})
