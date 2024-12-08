// models/Favorite.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  routeId: {
    type: String,
    required: true,
  },
  busId: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Favorite', favoriteSchema);
