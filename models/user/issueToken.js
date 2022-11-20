// Using jsonwebtoken module.
const jwt = require("jsonwebtoken");

const findUser = require("../models/findUser");

// importing .env file
require('dotenv').config();

module.exports = async function(id, address) {
    const user = await findUser(id);
    const payload = { // putting data into a payload
        id: user.id,
        address: user.address
    };
    const token = await jwt.sign(
        payload, // payload into jwt.sign method
        process.env.SECRET_KEY, // secret key value
        { expiresIn: "30m" } // token expiration time
    );
    return token;
}