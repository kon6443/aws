// homeService.js

const { Container } = require('typedi');
// const kakaoServiceInstance = require('../kakao/kakaoService');
const kakaoAPI = require('../kakao/kakaoService');
// const kakaoServiceInstance = new kakaoAPI();
const boredAPI = require('../APIs/boredAPI');

exports.getActivity = async () => {
    return await boredAPI.getActivity();
}

exports.getAuthenticateURL = () => {
    return kakaoServiceInstance.getAuthenticateURL();
}

exports.getLoggedInUser = async (jwtDecodedUser, kakao_access_token) => {
    if(jwtDecodedUser) {
        var user = jwtDecodedUser;
    } else if(kakao_access_token) {
        const {nickname, profile_image} = await kakaoServiceInstance.getUserInfo(kakao_access_token);
        var user = {
            id: nickname,
            address: profile_image
        }
    }
    return user;
}

exports.getTokens = async (AUTHORIZE_CODE) => {
    return {
        access_token,
        id_token,
        refresh_token
    } = await kakaoServiceInstance.getToken(AUTHORIZE_CODE);
}
