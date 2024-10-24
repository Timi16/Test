require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Create Telegram bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || 'Unknown';

  try {
    let user = await User.findOne({ telegramId: chatId });

    // If user doesn't exist, create a new user
    if (!user) {
      user = new User({ telegramId: chatId, username });
      await user.save();
    }

    // Send a message with an inline button to the user
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Open Website',
              url: `http://localhost:3000/?username=${username}`
            }
          ]
        ]
      }
    };

    bot.sendMessage(chatId, `Hello ${username}, click the button below to start the website.`, opts);
  } catch (err) {
    console.error('Error saving user:', err);
    bot.sendMessage(chatId, 'An error occurred while processing your request.');
  }
});

// Serve static files (for HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API route to get users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

