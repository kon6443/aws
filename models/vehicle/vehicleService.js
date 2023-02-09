// vehicleService.js

const path = require('path');
const rp = require('request-promise');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

exports.showMain = async (req, res, next) => {
    return res.sendFile(path.join(__dirname, '../../views/vehicle/vehicleMain.html'));
}

exports.getVehicleInfo = async (req, res, next) => {
    const {
        registYy, 
        registMt, 
        vhctyAsortCode, 
        registGrcCode, 
        prye
    } = req.query;
    console.log(req.query);

    var url = 'http://apis.data.go.kr/B553881/prfomncChckInfoService/prfomncChckInfoService';
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+process.env.PI_SERVICE_ENCODE; /* Service Key*/
    queryParams += '&' + encodeURIComponent('registYy') + '=' + encodeURIComponent(registYy);
    queryParams += '&' + encodeURIComponent('registMt') + '=' + encodeURIComponent(registMt);
    queryParams += '&' + encodeURIComponent('vhctyAsortCode') + '=' + encodeURIComponent(vhctyAsortCode);
    queryParams += '&' + encodeURIComponent('registGrcCode') + '=' + encodeURIComponent(registGrcCode);
    queryParams += '&' + encodeURIComponent('prye') + '=' + encodeURIComponent(prye);
    const options = {
        url: url+queryParams,
        method: 'GET'
    }
    const body = await rp(options);
    console.log(body);
    // vhctyAsortCode: 3
    // registGrcCode: 9
    // 
}

exports.errorHandler = (err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.log(err);
    }
}