// userService.js

const express = require("express");
const app = express();

const path = require('path');

// allows you to ejs view engine.
app.set('view engine', 'ejs');

// importing user schema.
const User = require('../DTO/user');

const userDAO = require('./userDAO');

// const userValidateCheck = require("../jwt/userValidateCheck");
// const encryptPassword = require("../jwt/encryptPassword");
// const loginCheck = require("../jwt/loginCheck");
// const issueToken = require("../jwt/issueToken");

// Main login page.
 exports.showMain = (req, res) => {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../../views/user/user'), {user:user});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/user/user.html'));
    }
}

// Sign up.
exports.signUp = async (req, res) => {
    const { id, address, pw, pwc } = req.body;

    // const errorFlag = await userValidateCheck(id, address, pw, pwc);
    const errorFlag = await userDAO.checkValidation(id, address, pw, pwc);

    // user typed something wrong.
    if(errorFlag) return res.status(200).send(errorFlag);

    const user = new User(req.body);

    // user.pw = await encryptPassword(user.pw);
    user.pw = await userDAO.encryptPassword(user.pw);

    user.save();
    return res.status(200).send('Your account has been created successfully, you can now log in.');
}

// Sing in.
exports.signIn = async (req, res) => {
    const { id, pw } = req.body;

    // const userConfirmed = await loginCheck(id, pw);
    const userConfirmed = await userDAO.loginCheck(id, pw);
    
    if(userConfirmed) {

        // const token = await issueToken(id);
        const token = await userDAO.issueToken(id);

        return res
            .cookie('user', token,{maxAge: 30 * 60 * 1000}) // 1000 is a sec
            .end();
    } else if(userConfirmed==false) {
        return res.status(200).send('Your ID is not correct.');
    }
    else {
        return res.status(200).send('Your password is not correct.');
    }
}

// Sign out.
exports.signOut = (req, res) => {
    return res.clearCookie('user').end();
}
