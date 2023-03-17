/**
 * UserController.js
 */

const path = require('path');

class UserController {
    constructor(container) {
        this.serviceInstance = container.get('userService');
    }

    handleGetMain = async (req, res, next)=> {
        try {
            const user = await this.serviceInstance.getUserInfo(req);
            if(user) {
                return res.render(path.join(__dirname, '../../views/user/user'), {user:user});
            } else {
                return res.render(path.join(__dirname, '../../views/user/loginPage'));
            }
        } catch(err) {
            console.error(err);
            return res.status(400).send(err.message);
        }
    }

    // sign-up 
    handlePostSignUp = async (req, res, next) => {
        const { id, address, pw, pwc } = req.body;
        try {
            const user = await this.serviceInstance.validateAndRegisterUser(id, address, pw, pwc);
            return res.status(200).send('Your account has been created successfully, you can now log in.');
        } catch(err) {
            console.error(err);
            return res.status(400).send(err.message);
        }
    }

    // sign-in
    handlePostLogIn = async (req, res, next) => {
        const {id, pw} = req.body;
        try {
            const jwt = await this.serviceInstance.authenticateAndIssueJwtToken(id, pw);
            return res.cookie('user', jwt, {maxAge: 60*60 * 1000}).end();
        } catch(err) {
            res.status(401).send(err.message);
        }
    }

    // logout
    handleDeleteLogOut = async (req, res, next) => {
        try {
            const loginMethod = await this.serviceInstance.getLoginMethod(req);
            switch(loginMethod) {
                case 'jwt': {
                    // Clear JWT that is stored in a client browser.
                    return res.clearCookie('user').end();
                }
                case 'kakao': {
                    const body = this.serviceInstance.kakaoLogout(req.session.access_token);
                    /**
                     * Deleting junk tokens in the session DB.
                     */
                    req.session.destroy();
                    return res.status(200).end();
                }
                default:
                    return res.status(400).send('There is no user info.');
            }
        } catch(err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }

    handleDeleteDisconnectKakao = async (req, res, next) => {
        try {
            const loginMethod = this.serviceInstance.getLoginMethod(req);
            switch(loginMethod) {
                case 'kakao': {
                    const result = await this.serviceInstance.disconnectKakao(req);
                    return res.status(200).send('Your Kakao profile and app has been disconnected.');
                }
                default: 
                    return res.status(400).send('There is no kakao user info.');
            }
        } catch(err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = UserController;
