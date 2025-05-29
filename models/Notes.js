const mongoose = require('mongoose');
const { Schema } = mongoose;
const noteSchema = new Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title : {
    type: String,
    required: true
  },
  content : {
    type: String,
    required: true
  },
  date : {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('note', noteSchema);