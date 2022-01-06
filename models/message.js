const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
  dateTime: { type: String, required: true },
  timestamp: { type: Number, required:true }
});

module.exports = mongoose.model('Message', messageSchema);