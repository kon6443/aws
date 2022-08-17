// loginCheck.js

// importing bcrypt moudle to encrypt user password.
const bcrypt = require('bcrypt');
const comparePassword = require('../models/comparePassword');
const findUser = require('../models/findUser');

// declaring saltRounds to decide cost factor of salt function.
const saltRounds = 10;

module.exports = async function(id, typedPw) {
    const user = await findUser(id);
    const dbPw = user.pw;
    const temp = await comparePassword(typedPw, dbPw);
    return temp;
};