"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip2location = require("ip2location-nodejs");
const path = require("path");
/**
 * Builds location based on client ip address
 */
async function locationFinder(req, res, next) {
    ip2location.IP2Location_init(path.join(__dirname, '../', '../', '../', 'tracer/IP2LOCATION-LITE-DB5.IPV6.BIN'));
    // find a way to obtain public ip address,
    // pass the public ip to ip database for location search
    const result = ip2location.IP2Location_get_all(req.ip);
    console.log(result);
    return next();
}
exports.locationFinder = locationFinder;
