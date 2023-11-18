const { buildSchema } = require('graphql');

const schema = buildSchema(`
type Email {
    address: String!
    subscriptions: [Subscription!]
}

type Subscription {
    id: ID!
    name: String!
    status: SubscriptionStatus!
}

type User {
    _id: ID!
    email: String!
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

input UserInput {
    email: String!
    password: String!
}

input EmailInput {
    address: String!
}

input SubscriptionInput {
    email: String!
    name: String!
}

enum SubscriptionStatus {
    ACTIVE
    UNSUBSCRIBED
}

type RootQuery {
    getEmailSubscriptions(email: String!): Email
    login(email: String!, password: String!): AuthData   # Login Query
}

type RootMutation {
    createUser(input: UserInput): User
    createEmail(input: EmailInput): Email
    addSubscription(input: SubscriptionInput): Subscription
    unsubscribe(email: String!, subscriptionId: ID!): Subscription
}

schema {
   query: RootQuery
   mutation: RootMutation
}
`)

module.exports = schema;
