const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/', function(req, res) {
    return res.sendFile(path.join(__dirname, '../login/login.html'));
});

router.post('/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
    console.log('body: ', req.body);
    return res.sendFile(path.join(__dirname, '../login/login.html'));
});

module.exports = router;

// app.get('/login', function(req, res) {
//     return res.sendFile(__dirname + '/login/login.html');
// });

// app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
//     console.log('body: ', req.body);
//     return res.sendFile(__dirname + '/login/login.html');
// });