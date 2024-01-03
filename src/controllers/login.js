import User from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import * as yup from "yup"
const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
});

const signJwt = (user) => {
    const token = jwt.sign({ userId: user.id, email: user.email }, "8ff954ec9147ae4a6a84a6f591f4cb52f7b4aa46459cbb9c944b24b0e1f13d01", { expiresIn: '1h' });
    return token;
}

const loginController = async (req, res) => {
    try {
        await loginSchema.validate(req.body, { abortEarly: false });

        const { email, password } = req.body;
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // If user doesn't exist, create a new user
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            user = await User.create({ email, password: hashedPassword });
            const token = signJwt(user);
            return res.status(201).json({
                message: 'User created and logged in',
                token
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = signJwt(user);

        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const errors = err.errors.map(error => error);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        console.error(err)
        res.status(500).json({ message: 'Server error' });
    }
}
export default loginController;