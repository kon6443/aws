// userRepository.js

// exports.findById = async (id) => {
//     return await User.findOne({id: id});
// }

// // importing user schema.
// const User = require('../DTO/user');
const container = require('../container/container');

class userRepository {
    constructor(container) {
        this.User = container.get('User');
    }
    async findById(id) {
        return await User.findOne({id: id});
    }
}

module.exports = userRepository;