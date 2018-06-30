"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * confirm credentials after captcha verification
 * @param username client username
 * @param password client passowrd
 */
async function confirmCredentials(username, password) {
    return 0;
}
/**
 * advertiser authentication function
 * @param data client authentication details with captcha response
 */
async function advertiserLogin(data) {
    return await confirmCredentials(data.username, data.password);
}
exports.advertiserLogin = advertiserLogin;
