
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authorize = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(401).json({message: "Empty token"});
    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = verifiedToken.userId;
        next();
    }
    catch(err) {
        res.status(500).json({message: `failed to authorize: ${err.message}`})
    }
}




