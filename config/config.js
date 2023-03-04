const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/**
 * Reason why to use both config file and .env file is to use auto complete feature.
 */
const config = {
    // Mongo DB
    MONGO: {
        URI: process.env.MONGO_URI
    },
    // Jasonwebtoken
    JWT: {
        SECRET: process.env.SECRET_KEY
    },
    // MySQL DB connection
    MYSQL: {
        USER: process.env.SQL_USER,
        PASSWORD: process.env.SQL_PASSWORD,
        DATABASE: process.env.MYSQL_DATABASE,
        ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD
    },
    KAKAO: {
        REDIRECT_URI: process.env.REDIRECT_URI,
        REST_API_KEY: process.env.REST_API_KEY, 
        CLIENT_SECRET: process.env.CLIENT_SECRET, 
        TOKEN_URI: process.env.TOKEN_URI, 
        LOGOUT_REDIRECT: process.env.LOGOUT_REDIRECT
    },
    SESSION: {
        // Session
        SECRET: process.env.SESSION_SECRET,
        // MySQL session store.
        STORAGE_HOST: process.env.SESSION_STORAGE_HOST,
        STORAGE_PORT: process.env.SESSION_STORAGE_PORT,
        STORAGE_USER: process.env.SESSION_STORAGE_USER,
        STORAGE_PASSWORD: process.env.SESSION_STORAGE_PASSWORD,
        STORAGE_DB: process.env.SESSION_STORAGE_DB
    },
    PUBLIC_INSTITUTION: {
        // Public institution api service key
        SERVICE_ENCODE: process.env.PI_SERVICE_ENCODE,
        SERVICE_DECODE: process.env.PI_SERVICE_DECODE
    }
};

module.exports = config;
