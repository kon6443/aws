// userService.js

// Using jsonwebtoken module.
const jwt = require("jsonwebtoken");
// importing bcrypt moudle to encrypt user password.
const bcrypt = require('bcrypt');

class userService {
    #config
    constructor(container) {
        // declaring saltRounds to decide cost factor of salt function.
        this.saltRounds = 10;

        // Importing user data access object.
        this.User = container.get('User');
        this.#config = container.get('config');
        this.kakaoServiceInstance = container.get('kakaoService');
        this.userRepository = container.get('userRepository');
    }

    async validateUserInfo(id, address, pw, pwc) {
        if(!id) return 'Please type your ID.';
        const user = await this.userRepository.findById(id);
        if(user) return `User name ${user.id} already exists`;
        if(!address) return 'Please type your address.';
        if(!pw) return 'Please type your password.';
        if(!pwc) return 'Please type your password confirmation.';
        if(pw !== pwc) return 'Your password and password confirmation is not matched!';
        return undefined;
    }

    async encryptPassword(pw) {
        const salt = await bcrypt.genSalt(this.saltRounds);
        pw = await bcrypt.hash(pw, salt);
        return pw;
    }
    async comparePassword(typedPw, dbPw) {
        return await bcrypt.compare(typedPw, dbPw);
    }

    async loginCheck(id, clientTypedPw) {
        const user = await this.userRepository.findById(id);
        if(user==null) return false;
        const userConfirmed = await bcrypt.compare(clientTypedPw, user.pw);
        return userConfirmed;
    }

    async issueToken(id, address) {
        const user = await this.userRepository.findById(id);
        const payload = { // putting data into a payload
            id: user.id,
            address: user.address
        };
        const token = await jwt.sign(
            payload, // payload into jwt.sign method
            this.#config.JWT.SECRET, // secret key value
            { expiresIn: "30m" } // token expiration time
        );
        return token;
    }

    getLoginMethod(req) {
        if(req.cookies.user) {
            return 'jwt';
        } else if(req.session.access_token) {
            return 'kakao';
        }
        return undefined;
    }

    async getJWTUserInfo(JWT_TOKEN, SECRET_KEY) {
        return await jwt.verify(JWT_TOKEN, SECRET_KEY);
    }
    async getKakaoUserInfo(kakao_access_token) {
        const { nickname, profile_image } = await this.kakaoServiceInstance.getUserInfo(kakao_access_token);
        const user = {
            id: nickname,
            address: profile_image
        }
        return user;
    }
    async getUserInfo(req) {
        const loginMethod = this.getLoginMethod(req);
        switch(loginMethod) {
            case 'jwt': {
                return await this.getJWTUserInfo(req.cookies.user, this.#config.JWT.SECRET);
            }
            case 'kakao': {
                return await this.getKakaoUserInfo(req.session.access_token);
            }
            default:
                break;
        }
    }

    async getLoggedInUser(jwtDecodedUser, kakao_access_token) {
        var user;
        if(jwtDecodedUser) {
            user = jwtDecodedUser;
        } else if(kakao_access_token) {
            // console.log('kakao_access_token:', kakao_access_token);
            const {nickname, profile_image} = await this.kakaoServiceInstance.getUserInfo(kakao_access_token);
            user = {
                id: nickname,
                address: profile_image
            }
        } else {
            return undefined;
        }
        return user;
    }
    async mongoDBSaveUser(id, address, pw) {
        var user = {
            id: id,
            address: address,
            pw: pw
        }
        user = new this.User(user);
        user.pw = await this.encryptPassword(pw);
        user.save();
    }

    /**
     * Sign out for Kakao.
     */
    async kakaoLogout(kakao_access_token) {
        return await this.kakaoServiceInstance.logout(kakao_access_token);
    }

    async disconnectKakao(kakao_access_token) {
        return await this.kakaoServiceInstance.unlink(kakao_access_token);
    }
}

module.exports = userService;
