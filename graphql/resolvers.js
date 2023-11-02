const Email = require('../models/email');
const Subscription = require('../models/subscription');
const User = require('../models/User');

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
            // Check if user already exists
            const existingUser = await User.findOne({ email: args.input.email });
            if (existingUser) {
                throw new Error('User already exists.');
            }

            // Create new user instance
            const user = new User({
                email: args.input.email,
                password: args.input.password // Automatically hashed due to pre-save hook
            });

            // Save user to the database
            const savedUser = await user.save();

            // Check if the email already exists, if not, create one
            let userEmail = await Email.findOne({ address: args.input.email });
            if (!userEmail) {
                userEmail = new Email({
                    address: args.input.email,
                });
                await userEmail.save();
            }

            // Return the saved user without the password
            return { ...savedUser._doc, password: null };
        } catch (error) {
            throw error;
        }
    },

    createEmail: async (args) => {
        // Check if email already exists, if not, create one
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