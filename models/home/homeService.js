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

exports.requestAuthorizationCode = async (req, res, next) => {
    try {
        const kakaoAuthURL = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id='+process.env.REST_API_KEY+'&redirect_uri='+process.env.REDIRECT_URI+'&prompt=login';
        return res.status(302).redirect(kakaoAuthURL);
    } catch(err) {
        return next(err);
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
    try {
        const body = await kakao.getUserInfo(access_token);
        const nickname = body.properties.nickname;
        const profile_image = body.properties.profile_image;

        console.log('nickname:', nickname);
        console.log('profile_image:', profile_image);
        return res.status(200).redirect('/user').json({
            nickname: nickname,
            profile_image: profile_image
        });
        return res.json({
            nickname: nickname,
            profile_image: profile_image
        });
    } catch(err) {
        next(err);
    }
}

exports.requestAccessToken = (req, res, next) => {
    console.log('-----requestAccessToken function has been called.-----');
    res.json({
        nickname: req.nickname,
        profile_image: req.profile_image
    });
}

exports.errorHandler = (err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.log(err);
        // console.log(err.message);
    }
}