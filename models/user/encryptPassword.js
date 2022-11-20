// importing bcrypt moudle to encrypt user password.
const bcrypt = require('bcrypt');

// declaring saltRounds to decide cost factor of salt function.
const saltRounds = 10;

module.exports = async function(pw) {
    const salt = await bcrypt.genSalt(saltRounds);
    pw = await bcrypt.hash(pw, salt);
    return pw;
};