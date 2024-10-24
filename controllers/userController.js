
const User = require('../models/User');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
        .select('-__v')
        .populate('referrals', 'username');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  getUserStats: async (req, res) => {
    try {
      const user = await User.findOne({ telegramId: req.params.telegramId })
        .select('-__v')
        .populate('referrals', 'username');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user stats' });
    }
  }
};

module.exports = userController;