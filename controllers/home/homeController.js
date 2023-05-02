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

}

module.exports = HomeController ;
