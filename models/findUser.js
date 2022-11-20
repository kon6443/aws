// importing user schema.
const User = require('./DTO/user');

module.exports = async function(id) {
    const user = await User.findOne({id:id});
    return user;
}