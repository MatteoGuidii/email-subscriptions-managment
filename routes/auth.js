const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

//SIGN-UP
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;  

        const result = zxcvbn(password);
        if(result.score < 3) { 
            return res.status(400).json({ message: "Password too weak", suggestions: result.feedback.suggestions });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const confirmationToken = crypto.randomBytes(20).toString('hex');

        // Create new user
        const user = new User({
            email: email,
            password: password,
            confirmationToken: confirmationToken

        });

        await user.save();

        user.confirmationToken = confirmationToken;
        await user.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Confirm your email',
            text: `Click on this link to confirm your email: http://your-website.com/confirm-email/${confirmationToken}`
        };
        transporter.sendMail(mailOptions);

        // Here, generate the JWT token after the user is saved
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


//LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;  // assuming you send email and password in the request body

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: "Email not registered" });
        }

        if (await user.isValidPassword(password)) {
            // Passwords match! Generate a JWT.
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.json({ token: token, userId: user._id, message: "Logged in successfully" }); 
        } 
        else {
            // Invalid password. Return an error or prompt the user.
            return res.status(401).json({ message: "Invalid password" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


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