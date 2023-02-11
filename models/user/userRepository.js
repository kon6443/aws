// userRepository.js

// exports.findById = async (id) => {
//     return await User.findOne({id: id});
// }

// // importing user schema.
const User = require('../DTO/user');

class userRepository {
    constructor() {
        this.User = User;
    }
    async findById(id) {
        return await User.findOne({id: id});
    }
}

module.exports = userRepository;