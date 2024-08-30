
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    threads: [{type: mongoose.Schema.Types.ObjectId, ref: 'Thread'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

export const User = mongoose.model('User', userSchema);