const mongoose = require('mongoose');


const connectDatabase = async () => {
    try {
        const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@emailsubmanager.ozvirjk.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDatabase;
