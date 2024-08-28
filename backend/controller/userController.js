
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    try {
        if (await User.findOne({email})) {
            return res.status(409).json({message: "email already exists"});;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName, email, password: hashedPassword})
        await user.save();
        res.status(201).json({
            message: "signup successful",
            data: user
        });
    } catch (err) {
        res.status(500).json({message: `Failed to signup: ${err.message}`});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({message: "user doesn't exist"});
        }
        const validPassword = bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({message: "wrong password"});
        }
        const token = jwt.sign({user}, process.env.JWT_SECRET_KEY, {expiresIn: '24h'}); // creates token every request???
        res.status(200).json({
            message: "login successfull",
            token: token,
            data: user
        });
    } catch (err) {
        res.status(500).json({message: `Failed to login: ${err.message}`});
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);;
        res.status(200).json({data: user});
    } catch (err) {
        res.status(500).json({message: `Failed to load profile: ${err.message}`});
    }
}

export const updateProfile = async (req, res) => {
    
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: "user doesn't exist"});
        };
        const newProfile = req.body;
        if (newProfile.password) {
            return res.status(401).json({message: "You can't update your password here"});
        }
        Object.keys(newProfile).forEach(key => {
            user[key] = newProfile[key];
        });
        await user.save()
        res.status(200).json({
            message: "Profile updated successfully",
            data: user
        });
    } catch (err) {
        res.status(500).json({message: `Failed to update profile: ${err.message}`});
    }
}

export const changePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: "user doesn't exist"});
        } else if (!oldPassword || await bcrypt.compare(oldPassword, user.password)) {
            return res.status(403).json({message: "old password is not correct"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({message: "Password successfully updated"});
    } catch (err) {
        res.status(500).json({message: `Failed to change password: ${err.message}`});
    }
}