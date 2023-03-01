// User.js

const userSchema = {  
  // Structuring a user schema. 
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
  }
};

module.exports = userSchema;
