// kakaoService.js

const path = require('path');
const rp = require('request-promise');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

/**
 * Kakao REST API 토큰받기
 */
exports.getToken = async (AUTHORIZE_CODE) => {
    const options = {
        uri: 'https://kauth.kakao.com/oauth/token?response_type=code&client_id='+process.env.REST_API_KEY+'&redirect_uri='+process.env.REDIRECT_URI,
        method: 'POST',
        /**
         * form means that `content-type : x-www-form-urlencoded`.
         * Use `form` format instead of `body` format since Kakao REST API only accepts `form` format.
         */
        form: {
            "grant_type": "authorization_code",  // authorization_code is a particular type of string.
            "client_id": process.env.REST_API_KEY, // REST API key value in app setting.
            "redirect_uri": process.env.REDIRECT_URI,  // Redirect_uri value in app setting.
            "code": AUTHORIZE_CODE,  // AUTHORIZE_CODE that received from the user.
            "client_secret": process.env.CLIENT_SECRET  // In order to enhance security when the authorization server issues a token. 
        },
        json: true
    }
    return await rp(options);
}

/**
 * Kakao REST API 사용자 정보 가져오기
 */
exports.getUserInfo = async (access_token) => {
    const options = {
        uri: 'https://kapi.kakao.com/v2/user/me',
        method: 'GET',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8',
            "Authorization": "Bearer "+access_token
        },
        json: true
    };
    try {
        const body = await rp(options);
        const nickname = body.properties.nickname;
        const profile_image = body.properties.profile_image;
        return {nickname, profile_image};
    } catch(err) {
        throw Error(err);
    }
}


/**
 * Kakao REST API 로그아웃
 * This function expires an access_token and a refresh_token in the session DB.
 * Not deleting tokens in the session DB. You will also need to delete tokens in session DB.
 * Kakao account and your service are still connected even though you use this function.
 */
exports.logout = async (access_token) => {
    const options = {
        uri: 'https://kapi.kakao.com/v1/user/logout',
        method: 'POST',
        headers: {
            "Authorization": "Bearer "+access_token
        },
        json: true
    }
    try {
        return await rp(options);
    } catch(err) {
        throw Error(err);
    }
}


/**
 * Kakao REST API 연결끊기
 */
exports.unlink = async (access_token) => {
    console.log('kakao-disconnection:', access_token);
    const options = {
        uri: 'https://kapi.kakao.com/v1/user/unlink',
        method: 'POST',
        headers: {
            "Authorization": "Bearer "+access_token
        },
        json: true
    }
    try {
        const body = await rp(options);
        console.log(body);
    } catch(err) {
        throw Error(err);
    }
}