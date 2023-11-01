// routes/gmail.js

const express = require('express');
const { google } = require('googleapis');
const OAuth2Data = require('../jsonCredentials.json');

const router = express.Router();

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

        // Assuming User model has a field for storing Gmail tokens
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

module.exports = router;
