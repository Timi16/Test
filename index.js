// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Telegram Bot Setup
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Start command for the Telegram bot
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const message = `Hello! Here’s some information about our projects:
    - Project Dolphins: A revolutionary platform that aims to protect marine life.
    Click the link below to learn more!
    
    🔗 [Visit Project Dolphins](https://t.me/DolphinsProject_Bot/Dolphins)`;

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Handle general messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text !== '/start') {
        bot.sendMessage(chatId, "Welcome back! Use /start to see project details.");
    }
});

// Error handling for polling errors
bot.on("polling_error", (error) => {
    console.error("Polling error:", error);
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Telegram bot is up and running...');
});
