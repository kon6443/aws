const express = require("express");
const router = express.Router();
const path = require('path');

// importing userValidateCheck funtion.
const userValidateCheck = require("../controllers/userValidateCheck");

// importing user schema.
const User = require('../models/user');

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

router.post('/:id/:address/:pw/:pwc', function(req, res) {
    const { id, address, pw, pwc } = req.body;
    const errorFlag = userValidateCheck(id, address, pw, pwc);
    if(errorFlag) { // user typed went wrong.
        return res.status(200).send(errorFlag);
    } else {
        const user = new User(req.body);
        return res.sendFile(path.join(__dirname, '../views/login/login.html'));
    }
});

module.exports = router;

// app.get('/login', function(req, res) {
//     return res.sendFile(__dirname + '/login/login.html');
// });

// app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
//     console.log('body: ', req.body);
//     return res.sendFile(__dirname + '/login/login.html');
// });