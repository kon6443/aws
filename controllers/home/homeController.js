/**
 * homeConroller.js
 */

const path = require('path');

class HomeController {
    constructor(HomeServiceInstance) {
        this.serviceInstance = HomeServiceInstance; 
    }

    handleGetMainPage = async (req, res) => {
        try {
            const activity = await this.serviceInstance.getActivity();
            const user = await this.serviceInstance.getLoggedInUser(req);
            if(user) {
                return res.render(path.join(__dirname, '../../views/home/home'), {user:user, activity: activity});
            }
            return res.render(path.join(__dirname, '../../views/home/home_no_user'), {activity: activity});
        } catch(err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }

    handleGetAuthenticateURLAndRedirect = async (req, res, next) => {
        try {
            const kakaoAuthURL = this.serviceInstance.getAuthenticateURL();
            return res.status(302).redirect(kakaoAuthURL);
        } catch(err) {
            return next(err);
        }
    }

    handleGetAuthCodeAndRedirect = async (req, res, next) => {
        const AUTHORIZE_CODE = req.query['code'];
        try {
            const {
                access_token,
                id_token,
                refresh_token
            } = await this.serviceInstance.getTokens(AUTHORIZE_CODE);
            req.session.access_token = access_token;
            req.session.id_token = id_token;
            req.session.refresh_token = refresh_token;
            return res.status(300).redirect('/user');
        } catch(err) {
            next(err);
        }
    }

    handleErrorHandling = async (err, req, res, next) => {
        if(err.message==='Invalid user') {
            res.sendFile(path.join(__dirname, '../../views/home/home.html'));
        } else {
            console.error(err);
            return res.status(500).send(err.mesasge);
        }
    }

}

module.exports = HomeController ;
