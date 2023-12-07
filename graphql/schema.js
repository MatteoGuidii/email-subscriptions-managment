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

type GmailMessage {
    id: ID!
    snippet: String!
    unsubscribeLink: String
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
    getGmailMessages: [GmailMessage!]  # Fetch messages with unsubscribe links
}

type RootMutation {
    createUser(input: UserInput): User
    createEmail(input: EmailInput): Email
    addSubscription(input: SubscriptionInput): Subscription
    unsubscribe(email: String!, subscriptionId: ID!): Subscription
    unsubscribeFromEmail(unsubscribeUrl: String!): String  # Unsubscribe by link
}

schema {
   query: RootQuery
   mutation: RootMutation
}
`)

module.exports = schema;
