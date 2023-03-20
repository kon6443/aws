/**
 * filter.js
 */

const jwt = require('jsonwebtoken');

class Filter {
    #config
    constructor(container) {
        this.#config = container.get('config');
        this.userServiceInstance = container.get('userService');
        this.kakaoServiceInstance = container.get('kakaoService');
    }

    async getJWTInfo(JWT_TOKEN, SECRET_KEY) {
        return await jwt.verify(JWT_TOKEN, SECRET_KEY);
    }

    async getKakaoInfo(kakao_access_token) {
        const { nickname, profile_image } = await this.kakaoServiceInstance.getUserInfo(kakao_access_token);
        const user = {
            id: nickname,
            address: profile_image
        }
        return user;
    }

    defineLoginMethod(req) {
        if(req.cookies.user) {
            return 'jwt';
        } else if(req.session.access_token) {
            return 'kakao';
        }
        return undefined; 
    }
    authenticationMethodDistinguisher = async (req, res, next) => {
        const loginMethod = this.defineLoginMethod(req);
        switch(loginMethod) {
            case 'jwt': {
                req.user = await this.getJWTInfo(req.cookies.user, this.#config.JWT.SECRET);
                return next();
            }
            case 'kakao': {
                req.user = await this.getKakaoInfo(req.session.access_token);
                return next();
            }
            default:
                return res.redirect('/user');
        }
    }
}

module.exports = Filter;
