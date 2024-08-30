
import { Thread } from "../models/post.js";
import mongoose from "mongoose";

export const getThreads = async (req, res) => {
    try {
        const threads = await Thread.find();
        return threads? res.status(200).json(threads): res.status(404).json({message: "no threads found"});
    } catch (err) {
        res.status(500).json({message: `Failed to retrieve threads: ${err.message}`});
    }
}

export const getThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        return thread? res.status(200).json(thread):  res.status(404).json({message: "no threads found"});
    } catch (err) {
        res.status(500).json({message: `Failed to retrieve thread: ${err.message}`});
    }
}

export const createThread = async (req, res) => {
    try {
        const {title, content} = req.body;
        const authorId = new mongoose.Types.ObjectId(req.userId);        
        const newthread = new Thread({author: authorId, title, content});
        await newthread.save();
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
        return res.status(201).json({
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
        if (!thread) return res.status(404).json({message: "failed to retrieve post"});
        if(req.userId !== thread.author) return res.status(401).json({message: "Unauthorized access"});

        return res.status(204).send({message: "post deleted successfully"});
    } catch (err) {
        return res.status(500).json({message: `failed to delete thread: ${err.message}`})
    }
}
