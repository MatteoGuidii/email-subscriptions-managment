//routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const saltRounds = 10; // You can adjust this value

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// SIGN-UP
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;  

        const result = zxcvbn(password);
        if (result.score < 3) { 
            return res.status(400).json({ message: "Password too weak", suggestions: result.feedback.suggestions });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const confirmationToken = crypto.randomBytes(20).toString('hex');

        const user = new User({
            email: email,
            password: hashedPassword,
            confirmationToken: confirmationToken
        });

        await user.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Confirm your email',
            text: `Click on this link to confirm your email: http://your-website.com/confirm-email/${confirmationToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                // Consider additional error handling logic here
            }
        });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({ token: token, userId: user._id, message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "Email not registered" });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.json({ token: token, userId: user._id, message: "Logged in successfully" });
        } else {
            return res.status(401).json({ message: "Invalid password" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// CONFIRM EMAIL
router.get('/confirm-email/:token', async (req, res) => {
    const confirmationToken = req.params.token;

    try {
        const user = await User.findOne({ confirmationToken: confirmationToken });
        if (!user) {
            return res.status(400).send('Invalid or expired confirmation token.');
        }

        user.confirmed = true;
        user.confirmationToken = null;
        await user.save();

        res.status(200).send('Email confirmed successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
