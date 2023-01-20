// kakaoService.js

const path = require('path');
const rp = require('request-promise');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

exports.getToken = async (AUTHORIZE_CODE) => {
    const options = {
        uri: process.env.TOKEN_URI,
        method: 'POST',
        /**
         * form means that `content-type : x-www-form-urlencoded`.
         * Use `form` format instead of `body` format since Kakao REST API only accepts `form` format.
         */
        form: {
            "grant_type": "authorization_code",  // authorization_code is a particular type of string.
            "client_id": process.env.REST_API_KEY, // REST API key value in app setting.
            "redirect_uri": process.env.REDIRECT_URI,  // Redirect_uri value in app setting.
            "code": AUTHORIZE_CODE,  // AUTHORIZE_CODE that received from the user.
            "client_secret": process.env.CLIENT_SECRET  // In order to enhance security when the authorization server issues a token. 
        },
        json: true
    }
    const body = await rp(options);
    return body;
}
