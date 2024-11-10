const { Router } = require("express");
const { userModel } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_USER } = require('../config');

const userRouter = Router();

// Signup schema validation using Zod
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase letter."
        })
        .refine((password) => /[a-z]/.test(password), {
            message: "Password must contain at least one lowercase letter."
        })
        .refine((password) => /\d/.test(password), {
            message: "Password must contain at least one number."
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "Password must contain at least one special character (!@#$%^&*)."
        }),
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
});

// Signup route
userRouter.post("/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save the user in the database
        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
        
        res.json({ msg: "Signup successful!" });
    } catch (error) {
        res.status(400).json({
            msg: "Error signing up.",
            errors: error.errors ? error.errors.map(err => err.message) : error.message,
        });
    }
});

// Signin route
userRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Incorrect Credentials" });
        }
        
        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Incorrect Credentials" });
        }
        
        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET_USER, { expiresIn: '1h' });
        
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during sign-in", error: error.message });
    }
});

module.exports = { userRouter };
