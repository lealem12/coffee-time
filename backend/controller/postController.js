
import { Thread } from "../models/post.js";
import { Comment } from "../models/comment.js";
import { User } from "../models/user.js";
import { io } from "../index.js";

export const getThreads = async (req, res) => {
    try {
        const threads = await Thread.find();
        return threads.length !== 0? res.status(200).json(threads): res.status(404).json({message: "no threads found"});
    } catch (err) {
        res.status(500).json({message: `Failed to retrieve threads: ${err.message}`});
    }
}

export const getThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id).populate('author').populate('comments').populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User'
            }
        });
        return thread? res.status(200).json(thread):  res.status(404).json({message: "no threads found"});
    } catch (err) {
        res.status(500).json({message: `Failed to retrieve thread: ${err.message}`});
    }
}

export const getAllThreadsOfUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("threads");
        res.status(200).json({threads: user.threads});
    } catch (err) {
        res.status(500).json({message: `Failed to retrieve user's threads: ${err.message}`});   
    }
}

export const createThread = async (req, res) => {
    try {
        const {title, content} = req.body;
        const author = await User.findById(req.userId);
        const newthread = new Thread({author, title, content});
        await newthread.save();
        author.threads.push(newthread);
        await author.save();
        io.emit('createdThread', newthread);
        res.status(201).json({
            message: "Thread created successfully",
            data: newthread
        });
    } catch (err) {
        res.status(500).json({message: `Failed to create thread: ${err.message}`});
    }
}

export const updateThread = async (req, res) =>{
    try {
        const threadId = req.params.id;
        const thread = await Thread.findById(threadId);
        if(!thread) return res.status(404).json({message: "Couldn't find thread"});
        if(req.userId !== thread.author.toString()) return res.status(401).json({message: "Unauthorized access"});
        
        const updatedThread = req.body;
        Object.keys(updatedThread).forEach( key => {
            thread[key] = updatedThread[key];
        });
        await thread.save();
        io.emit('updatedThread', thread);
        res.status(201).json({
            message: "Thread updated Successfully!",
            data: thread
        });
    } catch (err) {
        return res.status(500).json({error: `Failed to Update Thread: ${err.message}`});
    }
}

export const deleteThread = async(req, res) => {
    try{
        const threadId = req.params.id;
        const thread = await Thread.findByIdAndDelete(threadId);
        if (!thread) return res.status(404).json({message: "thread not found"});
        if(req.userId !== thread.author.toString()) return res.status(401).json({message: "Unauthorized access to thread"});

        const user = await User.findById(thread.author.toString());
        user.comments.remove(thread);
        await user.save();

        await Thread.deleteOne(thread);
        res.status(204).send({message: "thread deleted successfully"});
        io.emit('deletedThread', thread);
    } catch (err) {
        return res.status(500).json({message: `failed to delete thread: ${err.message}`});
    }
}

export const createComment = async (req, res) => {
    try {
        const {content} = req.body;
        const parentThread = await Thread.findById(req.params.id);
        const author = await User.findById(req.userId);
        const newComment = new Comment({author, parentThread, content});
        await newComment.save();

        author.comments.push(newComment);
        parentThread.comments.push(newComment);
        await author.save();
        await parentThread.save();
        
        io.emit('createdComment', newComment);
        res.status(201).json({message: "Comment added successfully"});
    } catch (err) {
        return res.status(500).json({message: `failed to add comment: ${err.message}`});
    }
}

export const updateComment = async (req, res) => {
    try {
        const existingComment = await Comment.findById(req.params.commentId);
        if (!existingComment || req.params.id !== existingComment.parentThread.toString())
            return res.status(404).json({message: "Comment not found"});
        if (req.userId !== existingComment.author.toString())
            return res.status(401).json({message: "Comment update unauthorized"});
        console.log(req.body)

        existingComment.content = req.body.content;
        await existingComment.save();

        io.emit('updatedComment', existingComment);
        res.status(200).json({message: "Comment updated successfully"});
    } catch (err) {
        return res.status(500).json({message: `failed to update comment: ${err.message}`});
    }
}

export const deleteComment = async(req, res) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if (!comment || req.params.id !== comment.parentThread.toString()) return res.status(404).json({message: "comment not found"});
        if(req.userId !== comment.author.toString()) return res.status(401).json({message: "Comment deletion unauthorized"});

        const user = await User.findById(comment.author.toString());
        console.log(comment)
        const parentThread = await Thread.findById(comment.parentThread.toString());
        console.log(user, parentThread)
        user.comments.remove(comment);
        parentThread.comments.remove(comment);
        await user.save();
        await parentThread.save();

        await Comment.deleteOne(comment);
        io.emit('deletedComment', comment);
        res.status(204).send({message: "comment deleted successfully"});
    } catch (err) {
        return res.status(500).json({message: `failed to delete comment: ${err.message}`});
    }
}

export const getParentThreadOfComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        res.status(301).redirect(`../../${comment.parentThread}`);
    } catch (err) {
        return res.status(500).json({message: `failed to redirect to parent thread of user's comments: ${err.message}`});
    }   
}

export const getAllCommentsOfUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("comments");
        res.status(200).json({comments: user.comments});
    } catch (err) {
        return res.status(500).json({message: `failed to get user's comments: ${err.message}`});
    }
}