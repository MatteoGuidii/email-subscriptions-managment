const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const gmailRoutes = require('./routes/gmail');
const cors = require('cors');

const connectDatabase = require('./config/database');
const authCheck = require('./middleware/auth-check');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
  origin: '*', // Allow any origin
  methods: 'OPTIONS, GET, POST, PUT, PATCH, DELETE', // Allow these HTTP methods
  allowedHeaders: 'Content-Type, Authorization', // Allow these headers
}));

app.use(express.json());
app.use('/login', authRoutes);
app.use('/gmail', gmailRoutes);
app.use(authCheck);

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true,
}));

connectDatabase()
  .then(() => {
    app.listen(5000, () => console.log('Server is running on port 5000'));
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
