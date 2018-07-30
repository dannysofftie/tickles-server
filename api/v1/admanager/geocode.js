"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip2location = require("ip2location-nodejs");
const path = require("path");
/**
 * Gets location, latitude and longitude the request is coming from,
 * based on client ip address
 */
async function locationGeocode(req, res, next) {
    ip2location.IP2Location_init(path.join(__dirname, '../', '../', '../', 'tracer/IP2LOCATION-LITE-DB5.IPV6.BIN'));
    // find a way to obtain public ip address,
    // pass the public ip to ip database for location search
    try {
        const result = await ip2location.IP2Location_get_all(req.ip);
        req['client-location'] = result;
    }
    catch (_a) {
        req['client-location'] = false;
    }
    return next(); // pass request to ad serving utility
}
exports.locationGeocode = locationGeocode;
