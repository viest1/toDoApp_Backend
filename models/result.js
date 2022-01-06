const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  time: { type: Number, required: true },
  avatarSrc: { type: String, required: true },
});

module.exports = mongoose.model('Result', resultSchema);