const express = require("express");
const router = express.Router();
const path = require('path');

// importing user schema.
const User = require('../module/user');

router.get('/', function(req, res) {
    const user = req.decoded;
    if(user) {
        console.log('user');
        return res.render(path.join(__dirname, '../views/login/login'), {user:user.docs});
        // return res.render('login', {user:user.docs});
    } else {
        console.log('!user');
        return res.sendFile(path.join(__dirname, '../views/login/login.html'));
    }
});

router.post('/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
    console.log('body: ', req.body);
    return res.sendFile(path.join(__dirname, '../views/login/login.html'));
});

module.exports = router;

// app.get('/login', function(req, res) {
//     return res.sendFile(__dirname + '/login/login.html');
// });

// app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
//     console.log('body: ', req.body);
//     return res.sendFile(__dirname + '/login/login.html');
// });