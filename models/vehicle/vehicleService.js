// vehicleService.js

const path = require('path');
const rp = require('request-promise');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

exports.showMain = (req, res, next) => {
    return res.sendFile(path.join(__dirname, '../../views/vehicle/vehicleMain.html'));
}

exports.getVehicleInfo = (req, res, next) => {
    const {
        registYy, 
        registMt, 
        vhctyAsortCode, 
        registGrcCode, 
        prye
    } = req.query;
    console.log(req.query);
}

exports.errorHandler = (err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.log(err);
    }
}