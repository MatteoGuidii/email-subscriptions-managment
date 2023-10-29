const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emailSchema = new Schema({
    address: { 
        type: String, 
        required: true 
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subscriptions: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Subscription'
    }]
});

module.exports = mongoose.model('Email', emailSchema);

