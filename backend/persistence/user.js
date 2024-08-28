
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const signupPersistence = async (newUser) => {
    const {firstName, lastName, email, password} = newUser;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {firstName, lastName, email, password: hashedPassword};
    return await User.create(newUser);
}

export const loginPersistence = async (email, password) => {
    const user = await User.findOne({email: email});
    if (!user) {
        return null;
    }
    return await bcrypt.compare(password, user.password)? user: null;
}

export const updateProfilePersistence = async (id, updatedProfile) => {
    const user = await User.findById(id);
    if (!user) {return null};
    Object.keys(updatedProfile).forEach(key => {
        user[key] = updatedProfile[key];
    });
    return await user.save()
}

export const changePasswordPersistence = async (id, oldPassword, newPassword) => {
    const user = await User.findById(id);
    if (!user || await bcrypt.compare(oldPassword, user.password)) {return null};
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return await user.save();
}