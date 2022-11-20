
const findUser = require('../models/findUser');
const findUser = require('../findUser');

module.exports = async function(id, address, pw, pwc) {
    if(!id) return 'Please type your ID.';
    const user = await findUser(id);
    if(user) return 'User name: ' + user.id + ' already exists';
    if(!address) return 'Please type your address.';
    if(!pw) return 'Please type your password.';
    if(!pwc) return 'Please type your password confirmation.';
    if(pw !== pwc) return 'Your password and password confirmation is not matched!';
    return 0;
}
