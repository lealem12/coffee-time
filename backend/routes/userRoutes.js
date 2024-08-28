
import { signup, login, updateProfile, changePassword, getProfile } from "../controller/userController.js";
import express from 'express';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/:id/profile', getProfile);
userRouter.put('/:id/profile', updateProfile);
userRouter.put('/:id/password', changePassword);

export default userRouter;
