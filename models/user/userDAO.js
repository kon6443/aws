// userDAO.js
const express = require("express");
const app = express();

// allows you to ejs view engine.
app.set('view engine', 'ejs');

// importing user schema.
const User = require('../DTO/user');

// importing bcrypt moudle to encrypt user password.
const bcrypt = require('bcrypt');
// declaring saltRounds to decide cost factor of salt function.
const saltRounds = 10;

// Using jsonwebtoken module.
const jwt = require("jsonwebtoken");

exports.checkValidation = async (id, address, pw, pwc) => {
    if(!id) return 'Please type your ID.';

    // const user = await findUser(id);
    const user = await User.findOne({id:id});

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

exports.comparePassword = async (dbPw, typedPw) => {
    return await bcrypt.compare(dbPw, typedPw); 
}

exports.loginCheck = async (id, clientTypedPw) => {
    const user = await User.findOne({id:id});
    if(user == null) return false;
    const userConfirmed = await this.comparePassword(clientTypedPw, user.pw);
    return userConfirmed;
}

exports.issueToken = async (id, address) => {
    const user = await User.findOne({id:id});
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
