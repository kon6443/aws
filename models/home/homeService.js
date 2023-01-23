// homeService.js

const kakao = require('../kakao/kakaoService');

const path = require('path');
const rp = require('request-promise');
const { access } = require('fs');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

exports.showHome = (req, res, next) => {
    try {
        const user = req.decoded;
        if(!user) {
            throw new Error('Invalid user');
        } else {
            return res.render(path.join(__dirname, '../../views/home/home'), {user:user});
        }
    } catch(e) {
        return next(e);
    }
}

exports.getAuthorizationCode = async (req, res, next) => {
    const AUTHORIZE_CODE = req.query['code'];
    try {
        var {
            access_token,
            id_token,
            refresh_token
        } = await kakao.getToken(AUTHORIZE_CODE);
        // req.access_token = access_token;
        // req.id_token = id_token;
        // req.refresh_token = refresh_token;
    } catch(err) {
        next(err);
    }
    try {
        const body = await kakao.getUserInfo(access_token);
        console.log(body);
        console.log(body.properties.nickname);
        console.log(body.properties.profile_image);
        req.nickname = body.properties.nickname;
        req.profile_image = body.properties.profile_image;
        return next();
    } catch(err) {
        next(err);
    }
    // return res.redirect('/auth/kakao/access-token');
}

exports.requestAccessToken = (req, res) => {
    console.log('requestAccessToken:');
    console.log(req);
    // console.log('req.access_token', req.access_token);
    // console.log('req.id_token', req.id_token);
    // console.log('req.refresh_token', req.refresh_token);
}

exports.errorHandler = (err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.log(err);
        // console.log(err.message);
    }
}