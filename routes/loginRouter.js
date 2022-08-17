const express = require("express");
const router = express.Router();
const path = require('path');

// importing userValidateCheck funtion.
const userValidateCheck = require("../controllers/userValidateCheck");
const encryptPassword = require("../controllers/encryptPassword");
const loginCheck = require("../controllers/loginCheck");
const issueToken = require("../controllers/issueToken");

// importing user schema.
const User = require('../models/user');

// Main login page.
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

// Sign up.
router.post('/:id/:address/:pw/:pwc', async function(req, res) {
    const { id, address, pw, pwc } = req.body;
    const errorFlag = await userValidateCheck(id, address, pw, pwc);
    if(errorFlag) { // user typed something wrong.
        return res.status(200).send(errorFlag);
    }
    const user = new User(req.body);
    user.pw = await encryptPassword(user.pw);
    user.save();
    return res.sendFile(path.join(__dirname, '../views/login/login.html'));
});

// Sing in.
router.post('/:id/:pw', async function(req, res) {
    const { id, pw } = req.body;
    const userCorrect = await loginCheck(id, pw);
    if(userCorrect) {
        const token = await issueToken(id);
        return res
            .cookie('user', token,{maxAge:30*60 * 1000}) // 1000 is a sec
            .end();
    } else {
        return res.status(200).send('Your password is not correct.');
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