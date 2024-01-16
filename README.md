# Email Unsubscription App

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Dependencies](#dependencies)
- [Contact](#contact)

## Introduction
The Email Unsubscription App is designed to streamline the process of unsubscribing from unwanted emails. By interfacing directly with the user's Gmail account, it identifies all active email subscriptions and allows users to unsubscribe with a single click. The goal is to reduce the time spent on managing subscriptions by 75%. The project is currently at the stage of setting up authentication and main dashboard interfaces.

## Prerequisites
Before running this project, make sure you have Node.js and npm (Node Package Manager) installed on your system. You can check if you have Node and npm installed by running the following commands in your terminal:
node --version
npm --version

If you do not have Node.js installed, download and install it from the official [Node.js website](https://nodejs.org/).

## Installation and Setup
To get the project up and running on your local machine, follow these steps:

1. Clone the repository:
git clone https://github.com/MatteoGuidii/email-subscriptions-managment.git

2. Navigate to the project directory:
cd email-subscriptions-managment

3. Install the necessary backend dependencies:
npm install

4. Create a `nodemon.json` file in the root directory for your environment variables:
```json
{
  "env": {
    "MONGO_USER": "yourMongoDBUsername",
    "MONGO_PASSWORD": "yourMongoDBPassword",
    "MONGO_DB": "yourMongoDBDatabaseName"
  }
}
```
⚠️ Important: Make sure to replace placeholders like `yourMongoDBUsername`, `yourMongoDBPassword`, `yourMongoDBDatabaseName`, and `yourSecretKey` with the actual values that you use for your application's configuration.

Set up your `.env` file in the root directory with the secret key and other configuration variables:
SECRET_KEY=yourSecretKey

📝 Note: The `.gitignore` file in your repository should include `nodemon.json`, `.env`, and any other configuration files containing sensitive information to ensure they are not accidentally committed to the repository.

Start the backend server:
npm start

Navigate to the frontend directory, install dependencies, and start the React app:
```
cd frontend/
npm install
npm start
```

Your frontend should now be running and accessible in your browser at `http://localhost:3000`.

🔐 As a best practice, never upload sensitive information like passwords or secret keys to a public repository. Always keep them private, and provide instructions for users to set up their own.

This section clearly outlines the steps needed to set up and run your project, along with important notes on handling sensitive information. Remember to review and update the content as necessary to match your project's specifics.

## Dependencies
This project uses several npm packages:

- express: The web framework for the backend.
- express-graphql: An Express middleware to create a GraphQL HTTP server.
- graphql: A query language for your API.
- mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
- bcrypt: A library for hashing passwords.
- jsonwebtoken: For implementing JWT authentication.
- zxcvbn: For password strength estimation.
- nodemailer: For sending emails.
- react, react-dom: The core React library and its DOM bindings.
- react-router-dom: DOM bindings for React Router.
  
During development, nodemon is used to automatically restart the server after file changes.

## Contact
For any inquiries or collaboration opportunities, you can reach me at matteoguidi55@gmail.com.

Project Link: https://github.com/MatteoGuidii/email-subscriptions-managment

