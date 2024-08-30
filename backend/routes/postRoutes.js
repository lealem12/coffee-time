
import express from 'express';
import { authorize } from "../middlewares/authMiddleware.js";
import { getThread, getThreads, createThread, updateThread, deleteThread } from '../controller/postController.js';

const postRouter = express.Router();
postRouter.use(authorize);

postRouter.get('/', getThreads);
postRouter.get('/:id', getThread);
postRouter.post('/', createThread);
postRouter.put('/:id', updateThread);
postRouter.delete('/:id', deleteThread);

export default postRouter;


