//Importing required modules
const express = require('express');   //Imported express from the express package
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');


//Configuration DB
const connectDatabase = require('./config/database');


const authCheck = require('./middleware/auth-check');


// Importing GraphQL schema and resolvers
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');


// Importing Routes
const authRoutes = require('./routes/auth');


//Initializing Express
const app = express();


//Middleware
app.use(bodyParser.json());  //To parse incoming json body
app.use('/login', authRoutes);  // Authentication route

app.use(authCheck); // Add this line to check for authentication on subsequent routes

// GraphQL setup
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true  // Enable GraphiQL tool
}));
    
    
// MongoDB connection using the config
connectDatabase()
    .then(() => {
        app.listen(3000, () => console.log('Server is running on port 3000'));
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
    });