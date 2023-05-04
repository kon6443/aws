/**
 * userService.js
 */

const jwt = require("jsonwebtoken");
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

    async validateUserInfo(id, address, pw, pwc) {
        if(!id) {
            throw new Error('Please type your ID.');
        }
        const user = await this.userRepository.findById(id);
        if(user) {
            throw new Error(`User name ${user.id} already exists`);
        }
        if(!address) {
            throw new Error('Please type your address.');
        }
        if(!pw) {
            throw new Error('Please type your password.');
        }
        if(!pwc) {
            throw new Error('Please type your password confirmation.');
        }
        if(pw !== pwc) {
            throw new Error('Your password and password confirmation must match exactly.');
        }
        return true;
    }
    
    async encryptPassword(pw) {
        const salt = await bcrypt.genSalt(this.saltRounds);
        pw = await bcrypt.hash(pw, salt);
        return pw;
    }

    async mongoDBSaveUser(id, address, pw) {
        const user = new this.User({
            id: id,
            address: address,
            pw: await this.encryptPassword(pw) 
        });
        user.save();
        return user;
    }

    async validateAndRegisterUser(id, address, pw, pwc) {
        try {
            await this.validateUserInfo(id, address, pw, pwc); 
            const user = await this.mongoDBSaveUser(id, address, pw);
            return user;
        } catch(err) {
            throw new Error(err.message);
        }
    }

    async authenticateAndIssueJwtToken(id, pw) {
        const user = await this.userRepository.findById(id);
        if(!user) {
            throw new Error('User not found.');
        }
        const isPasswordMatched = await bcrypt.compare(pw, user.pw);
        if(!isPasswordMatched) {
            throw new Error('Password is incorrect.');
        }
        // issuing a token.
        const payload = {
            id: user.id,
            address: user.address
        }
        const token =  await jwt.sign(
            payload,
            this.#config.JWT.SECRET,
            { expiresIn: '60m'}
        );
        return token;
    }

    /**
     * Sign out for Kakao.
     */
    async kakaoLogout(kakao_access_token) {
        return await this.kakaoServiceInstance.logout(kakao_access_token);
    }

    async disconnectKakao2(kakao_access_token) {
        return await this.kakaoServiceInstance.unlink(kakao_access_token);
    }

    async disconnectKakao(req) {
        const res = await this.kakaoServiceInstance.unlink(req.session.access_token);
        req.session.destroy();
        return res;
    }
}

module.exports = userService;
