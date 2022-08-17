// comparePassword.js

// importing user schema.
const User = require('../models/user');

// importing bcrypt moudle to encrypt user password.
const bcrypt = require('bcrypt');

module.exports = async function(dbPw, typedPw) {
    const user = await bcrypt.compare(dbPw, typedPw);
    console.log(user);
    return user;
}