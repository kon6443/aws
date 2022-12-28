// userService.js

const express = require("express");
const app = express();

const path = require('path');

// allows you to ejs view engine.
app.set('view engine', 'ejs');

// importing user schema.
const User = require('../DTO/user');

// Using jsonwebtoken module.
const jwt = require("jsonwebtoken");
// importing bcrypt moudle to encrypt user password.
const bcrypt = require('bcrypt');
// Importing user data access object.
const userDAO = require('./userDAO');

// declaring saltRounds to decide cost factor of salt function.
const saltRounds = 10;

exports.checkValidation = async (id, address, pw, pwc) => {
    if(!id) return 'Please type your ID.';
    // const user = await User.findOne({id:id});
    const user = await userDAO.findById(id);
    if(user) return 'User name: ' + user.id + ' already exists';
    if(!address) return 'Please type your address.';
    if(!pw) return 'Please type your password.';
    if(!pwc) return 'Please type your password confirmation.';
    if(pw !== pwc) return 'Your password and password confirmation is not matched!';
    return 0;
}

exports.encryptPassword = async (pw) => {
    const salt = await bcrypt.genSalt(saltRounds);
    pw = await bcrypt.hash(pw, salt);
    return pw;
}

exports.comparePassword = async (typedPw, dbPw) => {
    return await bcrypt.compare(typedPw, dbPw); 
}

exports.loginCheck = async (id, clientTypedPw) => {
    const user = await userDAO.findById(id);
    if(user==null) return false;
    const userConfirmed = await bcrypt.compare(clientTypedPw, user.pw); 
    return userConfirmed;
}

exports.issueToken = async (id, address) => {
    const user = await userDAO.findById(id);
    const payload = { // putting data into a payload
        id: user.id,
        address: user.address
    };
    const token = await jwt.sign(
        payload, // payload into jwt.sign method
        process.env.SECRET_KEY, // secret key value
        { expiresIn: "30m" } // token expiration time
    );
    return token;
}


/**
 * ===========================================================================================================================
 */
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
    const errorFlag = await this.checkValidation(id, address, pw, pwc);

    // user typed something wrong.
    if(errorFlag) return res.status(200).send(errorFlag);

    const user = new User(req.body);
    user.pw = await this.encryptPassword(user.pw);
    user.save();
    return res.status(200).send('Your account has been created successfully, you can now log in.');
}

// Sing in.
exports.signIn = async (req, res) => {
    var param = req.body;
    try {
        param = JSON.parse(Object.keys(param)[0]);
    } catch(err) {
        // console.log(err);
    }
    const {id, pw} = param;
    const userConfirmed = await this.loginCheck(id, pw);
    if(userConfirmed) {
        const token = await this.issueToken(id);
        return res
            .cookie('user', token,{maxAge: 30 * 60 * 1000}) // 1000 is a sec
            .end();
    } else {
        return res.status(200).send('Your password is not correct.');
    }
}

// Sign out.
exports.signOut = (req, res) => {
    return res.clearCookie('user').end();
}
