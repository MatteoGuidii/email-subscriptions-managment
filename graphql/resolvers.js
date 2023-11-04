const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Email = require('../models/email');
const Subscription = require('../models/subscription');
const User = require('../models/User');
require('dotenv').config();


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
    }
}

module.exports = resolvers;
