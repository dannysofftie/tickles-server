"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const querystring = require("querystring");
/**
 * verify captcha with Google
 * @param captcha captcha response
 * @param clientip client ip address
 */
async function verifyCaptcha(captcha, clientip) {
    return new Promise((resolve, reject) => {
        let cSecret = '6LdN1FEUAAAAAGHokcf3kHwvrWrfJ5hZfCGtDwE2', post = https_1.request({ method: 'POST', host: 'www.google.com', path: '/recaptcha/api/siteverify', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, (res) => {
            res.on('data', data => resolve(data));
            res.on('error', err => reject(err));
        });
        post.write(querystring.stringify({ secret: cSecret, response: captcha, remoteip: clientip }));
        post.on('error', err => reject(err));
        post.end();
    });
}
/**
 * confirm credentials after captcha verification
 * @param username client username
 * @param password client passowrd
 */
async function confirmCredentials(username, password) {
    return;
}
/**
 * advertiser authentication function
 * @param data client authentication details with captcha response
 */
async function advertiserLogin(data) {
    let captchaResult = await verifyCaptcha(data.captchaValue, data.ip).catch(err => err);
    if (captchaResult.code === 'EAI_AGAIN')
        return { error: 'network unreachable' };
    if (!!JSON.parse(captchaResult.toString()).success)
        return await confirmCredentials(data.username, data.password);
    else
        return { error: 'captcha error' };
}
exports.advertiserLogin = advertiserLogin;
