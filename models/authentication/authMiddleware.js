const jwt = require('jsonwebtoken');

// importing .env file
require('dotenv').config(); 

module.exports = (req, res, next) => {
    try {
        // verifying jwt using cookies and secret key then return it to req.decoded
        req.decoded = jwt.verify(req.cookies.user, process.env.SECRET_KEY);
        return next();
    }
    // autorized failed
    catch (err) {
        // Token has been expired
        if (err.name === 'TokenExpiredError') {
            next();
            // return res.status(419).json({
            //     code: 419,
            //     message: 'Token has been expired.'
            // }); 
        }
        // JsonWebTokenError
        if (err.name === 'JsonWebTokenError') {
            next();
            // return res.status(401).json({
            //     code: 401,
            //     message: 'Invalid token.'
            // });
        }
    }
}