const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    registeredEmails: [{
        type: Schema.Types.ObjectId,
        ref: 'Email'
    }],
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmationToken: String,
    gmailTokens: {
        access_token: String,
        refresh_token: String,
        scope: String,
        token_type: String,
        expiry_date: Number,
    },
});

userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);

        this.password = hash; 
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error('Error while validating password:', error);
        return false;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;
