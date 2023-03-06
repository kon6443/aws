// boredAPI.js

const rp = require('request-promise');

class boredAPI {
    async getActivity() {
        const options = {
            url: 'https://www.boredapi.com/api/activity',
            method: 'GET'
        }
        const body = await rp(options);
        return JSON.parse(body).activity;
    }
}

module.exports = boredAPI;
