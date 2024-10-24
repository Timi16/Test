const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },
  username: { type: String, unique: true },
});

const User = mongoose.model('Test', testSchema);
module.exports = User;
