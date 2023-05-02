// homeService.js

class homeService {
    #config
    constructor(container) {
        this.#config = container.get('config');
        this.boredAPIInstance = container.get('boredAPI');
        this.kakaoServiceInstance = container.get('kakaoService'); 
        this.filterInstance = container.get('Filter');
    } 
    async getActivity() {
        return await this.boredAPIInstance.getActivity();
    }

    getAuthenticateURL() {
        return this.kakaoServiceInstance.getAuthenticateURL();
    }

    async getLoggedInUser2(jwtDecodedUser, kakao_access_token) {
        if(jwtDecodedUser) {
            var user = jwtDecodedUser;
        } else if(kakao_access_token) {
            const {nickname, profile_image} = await this.kakaoServiceInstance.getUserInfo(kakao_access_token);
            var user = {
                id: nickname,
                address: profile_image
            }
        }
        return user;
    }

    async getLoggedInUser(req) {
        const loginMethod = this.filterInstance.defineLoginMethod(req); 
        switch(loginMethod) {
            case 'jwt': {
                return await this.filterInstance.getInfoWithJWT(req.cookies.user, this.#config.JWT.SECRET);
            }
            case 'kakao': {
                return await this.filterInstance.getInfoWithKakaoAccessToken(req.session.access_token);
            }
            default:
                return loginMethod;
        }
    }

    async getTokens(AUTHORIZE_CODE) {
        const {
            access_token,
            id_token,
            refresh_token
        } = await this.kakaoServiceInstance.getToken(AUTHORIZE_CODE);
        return {
            access_token,
            id_token,
            refresh_token
        }; 
    }
}

module.exports = homeService;
