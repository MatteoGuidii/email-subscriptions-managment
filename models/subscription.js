const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        required: true,
        enum: ['ACTIVE', 'UNSUBSCRIBED']
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);