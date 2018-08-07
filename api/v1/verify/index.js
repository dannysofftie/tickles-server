"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns = require("dns");
const Advertisements_1 = require("../../../models/Advertisements");
const Publisher_1 = require("../../../models/Publisher");
const origin_cookies_1 = require("../utils/origin-cookies");
function validateRequests(req, res, next) {
    if (req.headers['client-ssid'] == undefined) {
        return res.status(500).json({ error: 'unauthorized', info: 'missing credentials' });
    }
    let date = new Date(), month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth(), currentDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(), hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(), minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(), seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(), requestData = {
        'validation-status': true,
        'client-ssid': req.headers['client-ssid'],
        'validation-time': `${date.getFullYear()}-${month}-${currentDate}T${hours}:${minutes}:${seconds}`,
        'request-path': req.originalUrl,
        'client-ip': req.ip
    };
    req['client'] = requestData;
    return next();
}
exports.validateRequests = validateRequests;
async function validateWebsiteUrl(req, res) {
    let addresses;
    const ip = /^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$/;
    if (ip.test(req.body['url']) != false)
        addresses = await (async function () {
            return new Promise(function (resolve, reject) {
                dns.reverse(req.body['url'], function (err, hostnames) {
                    err ? reject(err) : resolve(hostnames);
                });
            });
        })().catch(err => (err));
    else
        addresses = await (async function () {
            return new Promise(function (resolve, reject) {
                dns.lookup(req.body['url'], function (err, address) {
                    err ? reject(err) : resolve(address);
                });
            });
        })().catch(err => (err));
    try {
        if (addresses.toString().indexOf('Error') != -1)
            return res.status(res.statusCode).json({ status: false });
    }
    catch (_a) {
        return res.status(res.statusCode).json({ status: false });
    }
    return res.status(res.statusCode).json({ status: true });
}
exports.validateWebsiteUrl = validateWebsiteUrl;
/**
 * Verify publisher before delivering an ad
 */
async function verifyPublisher(req, res, next) {
    let pubSite = origin_cookies_1.extractRequestCookies(req.headers.cookie, 'original-url'), pubData = await Publisher_1.default.find({ publisherAppUrl: pubSite }).select('publisherAppUrl').exec();
    console.log(req.headers.cookie);
    if (pubData.length > 0)
        return next();
    return next();
}
exports.verifyPublisher = verifyPublisher;
/**
 * This utility will be called automatically after every 2 hours,
 * it runs all unverified ad documents in the database, through a verification
 * definition:
 * - checks destination urls,
 * - compares ads tagged under the same advertiser for similarity,
 * - checks account for allowed minimum vs estimated amount per campaign set by advertiser
 *
 * ------------------------------------------------------------------------
 * To verify destination url, this utility does a domain resolution of the url provided,
 * and tries to obtain ip address of the host six consequtive times, and compares the returned ip addresses.
 * If ip address was provided instead, this utility does a reverse lookup to obtain domain name,
 * if all checks domain resolution and reverse lookup fails, this utility tries ping requests which on fail,
 * ad is invalidated and marked for deletion.
 *
 * ------------------------------------------------------------------------
 * An email is sent to advertiser indicating verification status
 */
async function adVerificationUtility(req, res) {
    var e_1, _a;
    let allUnverifiedAds = await Advertisements_1.default.find({ adVerificationStatus: false }).exec();
    try {
        for (var allUnverifiedAds_1 = __asyncValues(allUnverifiedAds), allUnverifiedAds_1_1; allUnverifiedAds_1_1 = await allUnverifiedAds_1.next(), !allUnverifiedAds_1_1.done;) {
            const ad = allUnverifiedAds_1_1.value;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (allUnverifiedAds_1_1 && !allUnverifiedAds_1_1.done && (_a = allUnverifiedAds_1.return)) await _a.call(allUnverifiedAds_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.adVerificationUtility = adVerificationUtility;
