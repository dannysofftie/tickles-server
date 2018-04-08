"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const querystring = require("querystring");
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
async function confirmCredentials(data) {
    return data;
}
async function advertiserLogin(data) {
    try {
        // @ts-ignore
        data = JSON.parse(data);
    }
    catch (e) {
        return { error: 'invalid data provided' };
    }
    let captchaResult = await verifyCaptcha(data.captchaValue, data.ip).then(data => data).catch(err => err);
    if (JSON.parse(captchaResult.toString()).success)
        return await confirmCredentials(data);
    else
        return JSON.parse(captchaResult.toString()).success;
}
exports.advertiserLogin = advertiserLogin;
