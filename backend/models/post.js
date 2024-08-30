
import mongoose from "mongoose";

const threadSchema = mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true});

export const Thread = mongoose.model('Thread', threadSchema);