"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Publisher_1 = require("../../../../models/Publisher");
const bcrypt = require("bcrypt");
async function publisherLogin() {
}
exports.publisherLogin = publisherLogin;
async function verifyPaypal(req, res) {
    let verificationPassword = await Publisher_1.default.find({ publisherSsid: req.headers['client-ssid'] }).select('').exec();
    if (verificationPassword.length < 1)
        return res.status(res.statusCode).json({ error: 'not-exist' });
    if (!bcrypt.compareSync(req.body['password'], verificationPassword[0]['publisherPassword']))
        return res.status(res.statusCode).json({ error: 'password-error' });
    await Publisher_1.default.findOneAndUpdate({ publisherSsid: req.headers['client-ssid'] }, {
        $set: {
            publisherDefaultWallet: 'paypal',
            walletAddress: req.body['emailAddress']
        }
    }, { new: true }).exec();
    return res.status(res.statusCode).json({ message: 'success' });
}
exports.verifyPaypal = verifyPaypal;
