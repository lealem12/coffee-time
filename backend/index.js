
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000

app.use(cors());
connectDB();
app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
})
