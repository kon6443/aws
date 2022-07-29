// User.js

const mongoose = require('mongoose'); // declaring mongoose.
const userSchema = mongoose.Schema({  // making a schema called userSchema.
  id: { 
    type: String,
    maxLength: 50,
    required: true,
    unique: 1, // exists one unique value
  },
  address: {
    type: String,
    required: true,
    maxLength: 100,
  },
  pw: {
    type: String,
    required: true,
    maxLength: 100,
  },
  pwc: {
    type: String,
    required: true,
    maxLength: 100,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User; // exporting user schema.
