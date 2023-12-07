const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { google } = require('googleapis');
const axios = require('axios'); // Make sure to install axios with `npm install axios`
const User = require('../models/User');
const Email = require('../models/email');
const Subscription = require('../models/subscription');
require('dotenv').config();

// Initialize OAuth2 Client here with your credentials
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

// Helper function to validate URLs
function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

// Function to log unsubscribe attempts
function logUnsubscribeAttempt(userId, unsubscribeUrl, statusCode) {
    // Implement logging logic here, possibly saving to a database or logging service
    console.log(`User ${userId} attempted to unsubscribe from ${unsubscribeUrl} with status code ${statusCode}`);
}

const resolvers = {
    getEmailSubscriptions: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated!');
        }
        try {
            const email = await Email.findOne({ address: args.email }).populate('subscriptions');
            return email;
        } catch (error) {
            throw error;
        }
    },

    //Database Update Query
    unsubscribe: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated!');
        }
        try {
            const subscription = await Subscription.findByIdAndUpdate(
                args.subscriptionId,
                { status: 'UNSUBSCRIBED' },
                { new: true }
            );
            return subscription;
        } catch (error) {
            throw error;
        }
    },

    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.input.email });
            if (existingUser) {
                throw new Error('User already exists.');
            }
            const user = new User({
                email: args.input.email,
                password: args.input.password
            });
            const savedUser = await user.save();
            let userEmail = await Email.findOne({ address: args.input.email });
            if (!userEmail) {
                userEmail = new Email({
                    address: args.input.email,
                });
                await userEmail.save();
            }
            return { ...savedUser._doc, password: null };
        } catch (error) {
            throw error;
        }
    },

    login: async (args) => {
        const user = await User.findOne({ email: args.email });
        if (!user) {
            throw new Error('User not found.');
        }
        const isValid = await user.isValidPassword(args.password);
        if (!isValid) {
            throw new Error('Incorrect password.');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        return { userId: user.id, token: token, tokenExpiration: 1 };
    },

    createEmail: async (args) => {
        let userEmail = await Email.findOne({ address: args.input.address });
        if (userEmail) {
            throw new Error('Email already exists.');
        }
        userEmail = new Email({
            address: args.input.address,
        });
        return await userEmail.save();
    },

    addSubscription: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated!');
        }
        const userEmail = await Email.findOne({ address: args.input.email });
        if (!userEmail) {
            throw new Error('Email not found.');
        }
        const subscription = new Subscription({
            name: args.input.name,
            status: 'ACTIVE',
        });
        await subscription.save();
        userEmail.subscriptions.push(subscription);
        await userEmail.save();
        return subscription;
    },

    // New resolver to fetch Gmail messages with unsubscribe links
    getGmailMessages: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated!');
        }

        const user = await User.findById(req.userId);
        if (!user || !user.gmailTokens) {
            throw new Error('User or Gmail tokens not found');
        }

        oAuth2Client.setCredentials(user.gmailTokens);

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        try {
            const response = await gmail.users.messages.list({
                userId: 'me',
                q: 'unsubscribe', // Query to search for 'unsubscribe' in emails
                maxResults: 10, // Limit to 10 results for example purposes
            });

            const messages = response.data.messages;
            const gmailMessages = [];

            for (const message of messages) {
                const fullMessage = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'full',
                });
                // Simplified parsing, real implementation needs to handle MIME message parts
                const body = fullMessage.data.snippet;
                const unsubscribeLink = body.match(/https?:\/\/.*?unsubscribe.*?/gi);

                if (unsubscribeLink) {
                    gmailMessages.push({
                        id: message.id,
                        snippet: body,
                        unsubscribeLink: unsubscribeLink[0]
                    });
                }
            }

            return gmailMessages;
        } catch (error) {
            throw new Error('Failed to fetch Gmail messages: ' + error.message);
        }
    },

    // New resolver to unsubscribe from an email by link
    unsubscribeFromEmail: async ({ unsubscribeUrl }, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated!');
        }
    
        // Verify that the URL is valid and secure
        if (!isValidHttpUrl(unsubscribeUrl)) {
            throw new Error('Invalid unsubscribe URL.');
        }
    
        try {
            // Perform the GET request to the unsubscribe URL
            const response = await axios.get(unsubscribeUrl, {
                validateStatus: false, // Do not throw an error for non-2xx status codes
                timeout: 5000, // Set a timeout for the request
            });
    
            // Log the attempt for auditing purposes
            logUnsubscribeAttempt(req.userId, unsubscribeUrl, response.status);
    
            // Check for various HTTP status codes and provide appropriate feedback
            switch (response.status) {
                case 200:
                    return 'Unsubscribed successfully.';
                case 202:
                    return 'Unsubscribe request accepted; processing may take some time.';
                case 429:
                    return 'Too many requests: please try again later.';
                case 503:
                    return 'Service unavailable: please try again later.';
                default:
                    return `Unsubscribe failed with status code: ${response.status}`;
            }
        } catch (error) {
            // Enhanced error handling
            if (error.code === 'ECONNABORTED') {
                throw new Error('Unsubscribe request timed out.');
            } else {
                throw new Error('Error during unsubscribe: ' + error.message);
            }
        }
    },
}

module.exports = resolvers;
