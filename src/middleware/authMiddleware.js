import jwt from 'jsonwebtoken';
import User from '../models/User.js' // Import your User model or adjust the path accordingly

export const verifyToken = async (req, res, next) => {

    let token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, "8ff954ec9147ae4a6a84a6f591f4cb52f7b4aa46459cbb9c944b24b0e1f13d01");

        const user = await User.findByPk(decoded.userId, {
            raw: true
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("Token verified")
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};


