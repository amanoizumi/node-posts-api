const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      // 是否為必填
      required: [true, '價格為必填'],
    },
    rating: Number,
    createdAt: {
      type: Date,
      default: Date.now,
      // 設定為不顯示
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;