// kakaoService.js

const container = require('../container/container');
const rp = require('request-promise');
// const config = require('../../config/config');

class kakaoService {
    #REST_API_KEY;
    #REDIRECT_URI;
    #LOGOUT_REDIRECT;
    #CLIENT_SECRET;
    #config;
    constructor(container) {
        console.log('kakaoAPI constructor has been called.');
        this.#config = container.get('config');
        this.#REST_API_KEY = this.#config.KAKAO.REST_API_KEY;
        this.#REDIRECT_URI = this.#config.KAKAO.REDIRECT_URI;
        this.#LOGOUT_REDIRECT = this.#config.KAKAO.LOGOUT_REDIRECT;
        this.#CLIENT_SECRET = this.#config.KAKAO.CLIENT_SECRET;
    }
    getAuthenticateURL() {
        return 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id='+this.#REST_API_KEY+'&redirect_uri='+this.#REDIRECT_URI+'&prompt=login';
    }
    getTokenProviderURL() {
        return 'https://kauth.kakao.com/oauth/token?response_type=code&client_id='+this.#REST_API_KEY+'&redirect_uri='+this.#REDIRECT_URI;
    }
    getDisconnectURL() {
        return 'https://kauth.kakao.com/oauth/logout?client_id='+this.#REST_API_KEY+'&logout_redirect_uri='+this.#LOGOUT_REDIRECT;
    }

    /**
     * Kakao REST API 토큰받기
     * @returns access_token, id_token, refresh_token
     */
    async getToken(AUTHORIZE_CODE) {
        const options = {
            uri: 'https://kauth.kakao.com/oauth/token?response_type=code&client_id='+this.#REST_API_KEY+'&redirect_uri='+this.#REDIRECT_URI,
            method: 'POST',
            /**
             * form means that `content-type : x-www-form-urlencoded`.
             * Use `form` format instead of `body` format since Kakao REST API only accepts `form` format.
             */
            form: {
                "grant_type": "authorization_code",  // authorization_code is a particular type of string.
                "client_id": this.#REST_API_KEY, // REST API key value in app setting.
                "redirect_uri": this.#REDIRECT_URI,  // Redirect_uri value in app setting.
                "code": AUTHORIZE_CODE,  // AUTHORIZE_CODE that received from the user.
                "client_secret": this.#CLIENT_SECRET  // In order to enhance security when the authorization server issues a token.
            },
            json: true
        }
        return await rp(options);
    }

    /**
     * Kakao REST API 사용자 정보 가져오기
     */
    async getUserInfo(access_token) {
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
    async logout(access_token) {
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
    async unlink(access_token) {
        const options = {
            uri: 'https://kapi.kakao.com/v1/user/unlink',
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
     * Kakao REST API 카카오계정과 함께 로그아웃
     * 미완성
     */
    async logoutWithKakaoAccount() {
        const options = {
            uri: 'https://kauth.kakao.com/oauth/logout?client_id='+this.#REST_API_KEY+'&logout_redirect_uri='+this.#LOGOUT_REDIRECT,
            method: 'GET',
            // headers: {

            // },
            json: true
        }
        try {
            return await rp(options);
        } catch(err) {
            throw Error(err);
        }
    }

    /**
     * Kakao REST API 토큰 갱신하기.
     * Not tested yet.
     */
    async renewExpiredToken(refresh_token) {
        const options = {
            uri: 'https://kauth.kakao.com/oauth/token',
            method: 'POST',
            form: {
                // "Content-Type": 'application/x-www-form-urlencoded',
                "client_id": this.#REST_API_KEY,
                "refresh_token": refresh_token,
                "client_secret": this.#CLIENT_SECRET
            },
            json: true
        }
        try {
            return await rp(options);
        } catch(err) {
            throw Error(err);
        }
    }
}

module.exports = kakaoService;
