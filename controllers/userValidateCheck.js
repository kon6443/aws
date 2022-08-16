
module.exports = function(id, address, pw, pwc) {
    if(!id) return 'Please type your ID.';
    if(!address) return 'Please type your address.';
    if(!pw) return 'Please type your password.';
    if(!pwc) return 'Please type your password confirmation.';
    if(pw !== pwc) return 'Your password and password confirmation is not matched!';
    return 0;
}

// module.exports = function(user) {
//     if(!req.body.id) console.log('Please type your ID.');
//     if(!req.body.address) console.log('Please type your address.');
//     if(!req.body.pw) console.log('Please type your password.');
//     if(!req.body.pwc) console.log('Please type your password confirmation.');
//     if(req.body.pw !== req.body.pwc) console.log('Your password and password confirmation is not matched!');
// }