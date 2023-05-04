/**
 * ChatService.js
 */

class ChatService {
    constructor(userService) {
        this.serviceInstance = userService;
    }

    async getUserInfo(req) {
        return await this.serviceInstance.getUserInfo(req);
    }

}

module.exports = ChatService;
