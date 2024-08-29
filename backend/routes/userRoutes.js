
import { signup, login, updateProfile, getProfile } from "../controller/userController.js";
import express from 'express';
import { authorize } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/profile/:id', getProfile);
userRouter.put('/profile/:id', authorize, updateProfile);

export default userRouter;
