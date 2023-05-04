/**
 * ChatController.js
 */

const path = require('path');

class ChatController {
    constructor(chatServiceInstance) {
        this.chatServiceInstance = chatServiceInstance;
    }

    handleGetMain = async (req, res, next) => {
        try {
            const user = await this.chatServiceInstance.getUserInfo(req);
            if(user) {
                return res.render(path.join(__dirname, '../../views/chat/chat'), {header:user.id + "'s message"});
            } else {
                return res.render(path.join(__dirname, '../../views/user/loginPage'));
            }
        } catch(err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }
    }

    handleErrorHandler = (err, req, res, next) => {
        console.error(err);
        return res.status(500).json({message: err.message});
    }

}

module.exports = ChatController;
