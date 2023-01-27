// chatService.js

const kakao = require('../kakao/kakaoService');

const path = require('path');

exports.showMain = async (req, res, next) => {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../../views/chat/chat'), {header:user.id + "'s message"});
    }
    if(req.session.access_token) {
        try {
            const {nickname, profile_image} = await kakao.getUserInfo(req.session.access_token);
            return res.render(path.join(__dirname, '../../views/chat/chat'), {header:nickname + "'s message"});
        } catch (err) {
            next(err);
        }
    }
    return res.render(path.join(__dirname, '../../views/user/loginPage'));
};

exports.errorHandler = (err, req, res, next) => {
    console.log(err);
}