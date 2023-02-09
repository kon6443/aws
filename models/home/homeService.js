// homeService.js

const kakao = require('../kakao/kakaoService');
const boredAPI = require('../APIs/boredAPI');

const path = require('path');
const rp = require('request-promise');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

exports.showHome = async (req, res, next) => {
    const activity = await boredAPI.getActivity();
    try {
        if(req.decoded) {
            var user = req.decoded;
        } else if(req.session.access_token) {
            const {nickname, profile_image} = await kakao.getUserInfo(req.session.access_token);
            var user = {
                id: nickname,
                address: profile_image
            }
        }
        if(user) {
            return res.render(path.join(__dirname, '../../views/home/home'), {user:user, activity: activity});
        }
        return res.render(path.join(__dirname, '../../views/home/home_no_user'), {activity: activity});
    } catch(e) {
        return next(e);
    }
}

exports.authenticate = async (req, res, next) => {
    try {
        const kakaoAuthURL = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id='+process.env.REST_API_KEY+'&redirect_uri='+process.env.REDIRECT_URI+'&prompt=login';
        return res.status(302).redirect(kakaoAuthURL);
    } catch(err) {
        return next(err);
    }
}

exports.authorize = async (req, res, next) => {
    const AUTHORIZE_CODE = req.query['code'];
    try {
        const {
            access_token,
            id_token,
            refresh_token
        } = await kakao.getToken(AUTHORIZE_CODE);
        req.session.access_token = access_token;
        req.session.id_token = id_token;
        req.session.refresh_token = refresh_token;
        return res.status(200).redirect('/user');
    } catch(err) {
        next(err);
    }
}

exports.errorHandler = (err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.log(err);
    }
}
