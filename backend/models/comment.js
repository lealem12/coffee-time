
import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    parentThread: {type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true},
    content: {type: String, required: true}
});

export const Comment = mongoose.model('Comment', commentSchema);
