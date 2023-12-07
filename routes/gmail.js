//routes/gmail.js

const express = require('express');
const { google } = require('googleapis');
const OAuth2Data = require('../jsonCredentials.json');
const User = require('../models/User'); 
const router = express.Router();

// Google OAuth configuration
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

router.get('/auth', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
    res.redirect(authUrl);
});

router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        if (!req.isAuth) {
            res.status(401).send('Not authenticated');
            return;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        user.gmailTokens = tokens;
        await user.save();

        res.send('Authentication successful');
    } catch (error) {
        console.error(error);
        res.status(400).send('Error retrieving access token');
    }
});

// Endpoint to fetch user's emails with 'UNSUBSCRIBE' links
router.get('/emails', async (req, res) => {
    if (!req.isAuth) {
        return res.status(401).send('Not authenticated');
    }

    const user = await User.findById(req.userId);
    if (!user || !user.gmailTokens) {
        return res.status(404).send('User or Gmail tokens not found');
    }

    // Set credentials for the Gmail API client
    oAuth2Client.setCredentials(user.gmailTokens);

    try {
        // Fetch messages
        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'unsubscribe', // Search for emails that contain the word 'unsubscribe'
            maxResults: 10,
        });

        // Here you would fetch each message's content and search for unsubscribe links
        // This is a simplified version and actual implementation would require more logic
        const messages = response.data.messages;
        const emails = [];
        for (const message of messages) {
            const fullMessage = await gmail.users.messages.get({ userId: 'me', id: message.id, format: 'full' });
            const body = fullMessage.data.snippet; // or decode fullMessage.data.payload.parts.body.data if in MIME format
            // Parse the body for unsubscribe links
            const unsubscribeLink = body.match(/https?:\/\/.*?unsubscribe.*?/gi); // This regex is simplified
            if (unsubscribeLink) {
                emails.push({ id: message.id, snippet: body, unsubscribeLink });
            }
        }

        res.json(emails);
    } catch (error) {
        console.error('Error fetching emails', error);
        res.status(500).send('Failed to fetch emails');
    }
});

module.exports = router;
