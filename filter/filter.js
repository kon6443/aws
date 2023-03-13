/**
 * filter.js
 */

class Filter {
    constructor(container) {
        this.userServiceInstance = container.get('userService');
    }
    authenticationMethodDistinguisher = async (req, res, next) => {
        const jwtDecodedUserInfo = req.decoded;
        const kakao_access_token = req.session.access_token;
        const user = await this.userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, kakao_access_token);
        if(!user) {
            return res.redirect('/user');
        }
        req.user = user;
        return next();
    }
}

module.exports = Filter;
