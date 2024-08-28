
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('DB connected...');
    } catch (err) {
        console.error(`Failed to connect to Database: ${err.message}`);
    }
}

