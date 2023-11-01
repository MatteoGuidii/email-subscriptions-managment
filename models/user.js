const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true  // to ensure one user per email
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
    gmailTokens: {  // New field for storing Gmail tokens
        access_token: String,
        refresh_token: String,
        scope: String,
        token_type: String,
        expiry_date: Number,
    },
});

// Hash user's password before saving it to the database
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();  // only hash if the password has been changed

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);

        this.password = hash;  // set the hashed password back on the user object
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);  // compare entered password with the hashed one
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model('User', userSchema);
