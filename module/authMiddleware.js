const jwt = require('jsonwebtoken');
const path = require('path');
// importing .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

exports.auth = (req, res, next) => {
    try {
        // verifying jwt using cookies and secret key then return it to req.decoded
        req.decoded = jwt.verify(req.cookies.user, process.env.SECRET_KEY);
        return next();
    }
    // autorized failed
    catch (error) {
        // Token has been expired
        if (error.name === 'TokenExpiredError') {
            console.log('auth TokenExpiredError');
            next();
            // return res.status(419).json({
            //     code: 419,
            //     message: 'Token has been expired.'
            // }); 
        }
        // JsonWebTokenError
        if (error.name === 'JsonWebTokenError') {
            console.log('JsonWebTokenError');
            next();
            // return res.status(401).json({
            //     code: 401,
            //     message: 'Invalid token.'
            // });
        }
    }
}