// boredAPI.js

const rp = require('request-promise');

exports.getActivity = async () => {
    const options = {
        url: 'https://www.boredapi.com/api/activity',
        method: 'GET'
    }
    const body = await rp(options);
    return JSON.parse(body).activity;
}
