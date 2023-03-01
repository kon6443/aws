// userRepository.js

const container = require('../container/container');

class userRepository {
    constructor(container) {
        this.User = container.get('User');
    }
    async findById(id) {
        return await this.User.findOne({id: id});
    }
}

module.exports = userRepository;