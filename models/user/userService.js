// userService.js

const express = require("express");
const app = express();
const config = require('../../config/config');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env')});

// allows you to ejs view engine.
app.set('view engine', 'ejs');

// importing user schema.
const User = require('../DTO/user');

// Using jsonwebtoken module.
const jwt = require("jsonwebtoken");
// importing bcrypt moudle to encrypt user password.
const bcrypt = require('bcrypt');

const container = require('../container/container');

class userService {
    constructor(container) {
        // declaring saltRounds to decide cost factor of salt function.
        this.saltRounds = 10;

        // Importing user data access object.
        this.kakaoServiceInstance = container.get('kakaoService');
        this.userRepository = container.get('userRepository');
    }

    async checkValidation(id, address, pw, pwc) {
        if(!id) return 'Please type your ID.';
        const user = await this.userRepository.findById(id);
        if(user) return 'User name: ' + user.id + ' already exists';
        if(!address) return 'Please type your address.';
        if(!pw) return 'Please type your password.';
        if(!pwc) return 'Please type your password confirmation.';
        if(pw !== pwc) return 'Your password and password confirmation is not matched!';
        return 0;
    }

    async encryptPassword(pw) {
        const salt = await bcrypt.genSalt(this.saltRounds);
        pw = await bcrypt.hash(pw, salt);
        return pw;
    }
    async comparePassword(typedPw, dbPw) {
        return await bcrypt.compare(typedPw, dbPw);
    }

    async loginCheck(id, clientTypedPw) {
        const user = await this.userRepository.findById(id);
        if(user==null) return false;
        const userConfirmed = await bcrypt.compare(clientTypedPw, user.pw);
        return userConfirmed;
    }

    async issueToken(id, address) {
        const user = await this.userRepository.findById(id);
        const payload = { // putting data into a payload
            id: user.id,
            address: user.address
        };
        const token = await jwt.sign(
            payload, // payload into jwt.sign method
            config.JWT.SECRET, // secret key value
            { expiresIn: "30m" } // token expiration time
        );
        return token;
    }

    async getLoggedInUser(jwtDecodedUser, kakao_access_token) {
        var user;
        if(jwtDecodedUser) {
            user = jwtDecodedUser;
        } else if(kakao_access_token) {
            const {nickname, profile_image} = await this.kakaoServiceInstance.getUserInfo(kakao_access_token);
            user = {
                id: nickname,
                address: profile_image
            }
        }
        return user;
    }
    async mongoDBSaveUser(id, address, pw) {
        var user = {
            id: id,
            address: address,
            pw: pw
        }
        user = new User(user);
        user.pw = await this.encryptPassword(pw);
        user.save();
    }

    /**
     * Sign out for Kakao.
     */
    async kakaoLogout(kakao_access_token) {
        return await this.kakaoServiceInstance.logout(kakao_access_token);
    }

    async disconnectKakao(kakao_access_token) {
        return await this.kakaoServiceInstance.unlink(kakao_access_token);
    }
}

module.exports = userService;
