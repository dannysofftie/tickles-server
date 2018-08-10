"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip2location = require("ip2location-nodejs");
const path = require("path");
const superagent = require("superagent");
/**
 * Gets location, latitude and longitude the request is coming from,
 * based on client ip address
 */
async function locationGeocode(req, res, next) {
    ip2location.IP2Location_init(path.join(__dirname, '../', '../', '../', 'tracer/IP2LOCATION-LITE-DB5.IPV6.BIN'));
    const ip = await (async () => {
        return new Promise((resolve, reject) => {
            superagent.get('http://ip.cn').set('User-Agent', 'curl/7.37.1')
                .end(function (err, res) {
                var ip = res.text.match(/\d+\.\d+\.\d+\.\d+/)[0];
                return resolve(ip);
            });
        });
    })();
    // find a way to obtain public ip address,
    // pass the public ip to ip database for location search
    try {
        const result = await ip2location.IP2Location_get_all(ip);
        req['client-location'] = result;
    }
    catch (_a) {
        req['client-location'] = false;
    }
    return next(); // pass request to ad serving utility
}
exports.locationGeocode = locationGeocode;
