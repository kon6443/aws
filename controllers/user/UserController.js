/**
 * UserController.js
 */

const path = require('path');

class UserController {
    constructor(container) {
        this.serviceInstance = container.get('userService');
    }
    getMainPage = async (req, res, next)=> {
        const user = await this.serviceInstance.getUserInfo(req);
        if(user) {
            return res.render(path.join(__dirname, '../../views/user/user'), {user:user});
        } else {
            return res.render(path.join(__dirname, '../../views/user/loginPage'));
        }
    }
    postResource = async (req, res, next) => {
        const { id, address, pw, pwc } = req.body;
        const isUserValidated = await this.serviceInstance.validateUserInfo(id, address, pw, pwc);
        console.log(isUserValidated);
        // User typed something wrong.
        if(isUserValidated) return res.status(404).send(isUserValidated);

        await this.serviceInstance.mongoDBSaveUser(id, address, pw);
        return res.status(200).send('Your account has been created successfully, you can now log in.');
    }

    postLogIn = async (req, res, next) => {
        const {id, pw} = req.body;
        const userConfirmed = await this.serviceInstance.loginCheck(id, pw);
        if(userConfirmed) {
            const token = await this.serviceInstance.issueToken(id);
            return res
                .cookie('user', token,{maxAge: 30 * 60 * 1000}) // 1000 is a sec
                .end();
        } else {
            return res.status(400).send('Your password is not correct.');
        }
    }
    deleteLogOut = async (req, res, next) => {
        // Sign out for Kakao.
        if(req.session.access_token) {
            const body = this.serviceInstance.kakaoLogout(req.session.access_token);
            /**
             * Deleting junk tokens in the session DB.
             */
            req.session.destroy();
            return res.status(200).end();
        }

        // Sign out for local account that uses JWT.
        return res.clearCookie('user').end();
    }
    disconnetKakao = async (req, res, next) => {
        const loginMethod = this.serviceInstance.getLoginMethod(req);
        switch(loginMethod) {
            case 'kakao': {
                const body = await this.serviceInstance.disconnectKakao(req.session.access_token);
                req.session.destroy();
                return res.status(302).redirect('/user');
            }
            default: 
                return next('No kakao user info.');
        }
    }
}

module.exports = UserController;