// homeService.js

const kakao = require('../kakao/kakaoService');

const path = require('path');
const rp = require('request-promise');

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
    } catch(err) {
        next(err);
    }
    console.log('access_token:', '\n');
    console.log('id_token:', '\n');
    console.log('refresh_token:', '\n');
}

exports.requestAccessToken = (req, res) => {
    console.log('requestAccessToken');
    const body = req.body;
    console.log('requestAccessToken: ', body['access_token']);
}

exports.errorHandler = (err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.log(err.message);
    }
}