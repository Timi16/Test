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

// Web app URL (replace with your actual hosted HTML page URL)
const webAppUrl = 'https://dolphins-ai6u.onrender.com'; // Replace with your actual URL

// Start command for the Telegram bot
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const message = `Welcome to Dolphin Task! 🐬 Dive into exciting tasks, earn rewards, and explore the world of dolphins! Complete tasks, collect points, and unlock surprises along the way. Ready to make a splash? Let’s get started!`;

    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                [
                    { 
                        text: "🐬 Open Dolphin Task Web App", 
                        web_app: { url: webAppUrl }  // This opens your web app in the blue button
                    }
                ]
            ],
            resize_keyboard: true, // Makes the keyboard fit nicely at the bottom
            one_time_keyboard: true // Hides the keyboard after the button is clicked
        }
    };

    bot.sendMessage(chatId, message, options);
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

