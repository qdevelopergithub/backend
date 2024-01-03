import jwt from 'jsonwebtoken';
import User from '../models/User.js' // Import your User model or adjust the path accordingly

export const verifyToken = async (req, res, next) => {

    let token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);
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


