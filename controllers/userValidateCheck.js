
const findUser = require('../models/findUser');

module.exports = async function(id, address, pw, pwc) {
    if(!id) return 'Please type your ID.';
    const user = await findUser(id);
    if(user) return 'there is: ' + user.id;
    if(!address) return 'Please type your address.';
    if(!pw) return 'Please type your password.';
    if(!pwc) return 'Please type your password confirmation.';
    if(pw !== pwc) return 'Your password and password confirmation is not matched!';
    return 0;
}
