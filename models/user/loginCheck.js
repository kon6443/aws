// loginCheck.js

// // importing bcrypt moudle to encrypt user password.
// const bcrypt = require('bcrypt');

const comparePassword = require('../models/comparePassword');
const findUser = require('../models/findUser');

module.exports = async function(id, clientTypedPw) {
    const user = await findUser(id);
    if(user == null) return false;
    const userConfirmed = await comparePassword(clientTypedPw, user.pw);
    return userConfirmed;
};