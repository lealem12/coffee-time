
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/threads', postRouter);

app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
})
