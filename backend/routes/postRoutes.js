
import express from 'express';
import { authorize } from "../middlewares/authMiddleware.js";
import { getThread, getThreads, createThread, updateThread, deleteThread, createComment, updateComment, deleteComment, getAllThreadsOfUser, getAllCommentsOfUser, getParentThreadOfComment } from '../controller/postController.js';

const postRouter = express.Router();
postRouter.use(authorize);

postRouter.get('/', getThreads);
postRouter.get('/:id', getThread);
postRouter.post('/', createThread);
postRouter.put('/:id', updateThread);
postRouter.delete('/:id', deleteThread);
postRouter.get('/api/my-threads/', getAllThreadsOfUser);

postRouter.post('/:id/comments', createComment);
postRouter.put('/:id/comments/:commentId', updateComment);
postRouter.delete('/:id/comments/:commentId', deleteComment);
postRouter.get('/api/my-comments', getAllCommentsOfUser);
postRouter.get('/api/my-comments/:commentId', getParentThreadOfComment);

export default postRouter;
