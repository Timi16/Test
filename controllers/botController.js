// controllers/botController.js
const User = require('../models/User');

const calculatePoints = (referralCount) => {
  if (referralCount >= 5) return 25000;
  if (referralCount >= 4) return 100;
  return 0;
};

const botController = {
  handleMessage: async (bot, msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || 'Unknown';
    const referralCode = msg.text && msg.text.startsWith('/start ') 
      ? msg.text.split(' ')[1] 
      : null;

    try {
      let user = await User.findOne({ telegramId: chatId });

      if (!user) {
        user = new User({
          telegramId: chatId,
          username,
          referralCode: Math.random().toString(36).substring(7),
          referredBy: referralCode
        });
        await user.save();

        if (referralCode) {
          const referrer = await User.findOne({ referralCode });
          if (referrer) {
            referrer.referrals.push(user._id);
            referrer.points = calculatePoints(referrer.referrals.length);
            await referrer.save();
            
            bot.sendMessage(referrer.telegramId, 
              `${username} joined using your referral! You now have ${referrer.referrals.length} referrals and ${referrer.points} points!`);
          }
        }
      }

      const shareLink = `https://t.me/YourBotUsername?start=${user.referralCode}`;
      
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Open Website',
              url: `https://test-c0vw.onrender.com/?username=${username}`
            }],
            [{
              text: 'Share Referral Link',
              url: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent('Join using my referral link!')}`
            }]
          ]
        }
      };

      const message = `
Hello ${username}!

Your Referral Stats:
• Points: ${user.points}
• Referrals: ${user.referrals.length}
• Your Referral Code: ${user.referralCode}

Share your referral link to earn points:
• 100 points for 4 referrals
• 25000 points for 5 referrals

Click below to share or visit the website!`;

      bot.sendMessage(chatId, message, opts);
    } catch (error) {
      console.error('Error:', error);
      bot.sendMessage(chatId, 'An error occurred while processing your request.');
    }
  }
};

module.exports = botController;
