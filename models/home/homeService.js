// homeService.js

class homeService {
    constructor(container) {
        this.boredAPIInstance = container.get('boredAPI');
        this.kakaoServiceInstance = container.get('kakaoService'); 
    } 
    async getActivity() {
        return await this.boredAPIInstance.getActivity();
    }

    getAuthenticateURL() {
        return this.kakaoServiceInstance.getAuthenticateURL();
    }

    async getLoggedInUser(jwtDecodedUser, kakao_access_token) {
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
