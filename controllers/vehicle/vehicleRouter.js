const express = require("express");
const router = express.Router();


const vehicleService = require('../../models/vehicle/vehicleService');

// /vehicle/
router.get('/', vehicleService.showMain);
router.get('/:registYy/:registMt/:vhctyAsortCode/:registGrcCode/:prye', vehicleService.getVehicleInfo);

// router.use(homeMiddleWare.errorHandler);

module.exports = router;